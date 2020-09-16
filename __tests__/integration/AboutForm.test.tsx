import '@testing-library/jest-dom/extend-expect';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

// eslint-disable no-undef
import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseError } from 'firebase';
import AboutForm from '../../components/forms/AboutForm';
import {
  getAboutPage,
  updateAboutPage,
} from '../../firebase/repositories/AboutPageRepository';

jest.mock('../../firebase/repositories/AboutPageRepository');
const aboutMockText = 'About mock text';

const getAboutPageMock = jest.fn(
  () => new Promise((resolve) => resolve(aboutMockText))
);
const updateAboutPageMock = jest.fn(
  (content: string) => new Promise((resolve) => resolve(''))
);

const MockError: FirebaseError = {
  code: '',
  message: 'rejected',
  name: '',
};

const getAboutPageMockReject = jest.fn(
  () => new Promise((resolve, reject) => reject(MockError))
);
const updateAboutPageMockReject = jest.fn(
  (content: string) => new Promise((resolve, reject) => reject(MockError))
);

jest.mock('next/router', () => ({
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
}));

beforeEach(() => {
  (getAboutPage as any).mockImplementation(getAboutPageMock);
  (updateAboutPage as any).mockImplementation(updateAboutPageMock);
});
it('should display about page text data from firebase', async () => {
  act(() => {
    render(<AboutForm />);
  });
  const resolvedElem = await waitFor(() =>
    screen.getByLabelText(/About Page Content/i)
  );

  expect(resolvedElem.textContent).toEqual(aboutMockText);
});

it('should update the about page in firebase with user input on submit', async () => {
  act(() => {
    render(<AboutForm />);
  });
  await waitFor(() => screen.getByLabelText(/About Page Content/i));

  const editedContent = 'Edited Content';
  fireEvent.change(screen.getByLabelText('About Page Content'), {
    target: { value: editedContent },
  });
  expect(screen.getByLabelText(/About Page Content/i).textContent).toBe(
    editedContent
  );

  fireEvent.click(screen.getByText(/Save/));
  expect(updateAboutPageMock).toBeCalledWith(editedContent);
  await waitForElementToBeRemoved(() => screen.getByRole('status'));
  expect(screen.getByText('Save').getAttribute('disabled')).toBe(null);
});

it('should display a firebase error if the about page data fails to load', async () => {
  (getAboutPage as any).mockImplementation(getAboutPageMockReject);

  act(() => {
    render(<AboutForm />);
  });
  await waitFor(() => screen.getByLabelText(/About Page Content/i));

  expect(await screen.findByText(MockError.message)).toBeInTheDocument();
});

it('should display a firebase error if the submission to Firebase fails', async () => {
  (updateAboutPage as any).mockImplementation(updateAboutPageMockReject);

  act(() => {
    render(<AboutForm />);
  });
  await waitFor(() => screen.getByLabelText(/About Page Content/i));

  const editedContent = 'Edited Content';
  fireEvent.change(screen.getByLabelText('About Page Content'), {
    target: { value: editedContent },
  });
  expect(screen.getByLabelText(/About Page Content/i).textContent).toBe(
    editedContent
  );

  fireEvent.click(screen.getByText(/Save/));
  expect(updateAboutPageMockReject).toBeCalledWith(editedContent);
  await waitForElementToBeRemoved(() => screen.getByRole('status'));
  expect(screen.getByText('Save').getAttribute('disabled')).toBe(null);
  expect(await screen.findByText(MockError.message)).toBeInTheDocument();
});
