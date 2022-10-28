/* eslint-disable no-promise-executor-return */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import ReactDOM from 'react-dom';
import { FirebaseError } from 'firebase/app';
import AboutForm from '../../components/forms/AboutForm';
import {
  getAboutPageRequest,
  updateAboutPageRequest,
} from '../../firebase/repositories/AboutPageRepository';

jest.mock('../../firebase/repositories/AboutPageRepository');
const aboutMockText = 'About mock text';

const getAboutPageRequestMock = jest.fn(
  () => new Promise((resolve) => resolve(aboutMockText))
);
const updateAboutPageRequestMock = jest.fn(
  (content: string) => new Promise((resolve) => resolve(''))
);

const MockError: FirebaseError = {
  code: '',
  message: 'rejected',
  name: '',
};

const getAboutPageRequestMockReject = jest.fn(
  () => new Promise((resolve, reject) => reject(MockError))
);
const updateAboutPageRequestMockReject = jest.fn(
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
  (getAboutPageRequest as any).mockImplementation(getAboutPageRequestMock);
  (updateAboutPageRequest as any).mockImplementation(
    updateAboutPageRequestMock
  );
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
  render(<AboutForm />);
  await waitFor(() => screen.getByLabelText(/About Page Content/i));
  const editedContent = 'Edited Content';
  fireEvent.change(screen.getByLabelText(/About Page Content/i), {
    target: { value: editedContent },
  });
  expect(screen.getByLabelText(/About Page Content/i).textContent).toBe(
    editedContent
  );

  const promise = Promise.resolve();
  fireEvent.click(screen.getByText(/Save/));
  await act(() => promise);
  expect(updateAboutPageRequestMock).toBeCalledWith(editedContent);
  expect(screen.getByText('Save').getAttribute('disabled')).toBe(null);
});

it('should display a firebase error if the about page data fails to load', async () => {
  (getAboutPageRequest as any).mockImplementation(
    getAboutPageRequestMockReject
  );

  render(<AboutForm />);
  await waitFor(() => screen.getByLabelText(/About Page Content/i));

  expect(await screen.findByText(MockError.message)).toBeInTheDocument();
});

// it('should display a firebase error if the submission to Firebase fails', async () => {
//   (updateAboutPageRequest as any).mockImplementation(updateAboutPageRequestMockReject);

//   act(() => {
//     render(<AboutForm />);
//   });
//   await waitFor(() => screen.getByLabelText(/About Page Content/i));

//   const editedContent = 'Edited Content';
//   fireEvent.change(screen.getByLabelText('About Page Content'), {
//     target: { value: editedContent },
//   });
//   expect(screen.getByLabelText(/About Page Content/i).textContent).toBe(
//     editedContent
//   );

//   fireEvent.click(screen.getByText(/Save/));
//   expect(updateAboutPageRequestMockReject).toBeCalledWith(editedContent);
//   await waitForElementToBeRemoved(() => screen.getByRole('status'));
//   expect(screen.getByText('Save').getAttribute('disabled')).toBe(null);
//   expect(await screen.findByText(MockError.message)).toBeInTheDocument();
// });
