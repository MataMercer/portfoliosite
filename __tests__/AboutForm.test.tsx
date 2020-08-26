// eslint-disable no-undef
import React from 'react';
import ReactDOM from 'react-dom';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  screen,
} from '@testing-library/react';
import AboutForm from '../components/forms/AboutForm';
import '@testing-library/jest-dom/extend-expect';

const aboutMockText = 'About mock text';

jest.mock('./../firebase/FirebaseContext', () => ({
  useFirebase: () => ({
    database: {
      collection: () => ({
        doc: () => ({
          get: () =>
            Promise.resolve({
              exists: true,
              data: () => ({
                content: aboutMockText,
              }),
            }),
        }),
      }),
    },
  }),
}));

afterEach(cleanup);

it('should display about page text data from firebase', async () => {
  const { getByText, getByLabelText } = render(<AboutForm />);
  try {
    const resolvedElem = await waitFor(() =>
      screen.getByLabelText(/About Page Content/i)
    );

    expect(resolvedElem.textContent).toBe(aboutMockText);
  } catch (err) {
    console.log(err);
  }
});
