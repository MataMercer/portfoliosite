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
import ProjectEntryForm from '../../components/forms/ProjectEntryForm';
import { IProjectEntry } from '../../ModelTypes/interfaces';
import { getProjectEntry } from '../../firebase/repositories/ProjectEntryRepository';

jest.mock('../../firebase/repositories/ProjectEntryRepository');

const projectEntryMock: IProjectEntry = {
  id: '0',
  title: 'Mock Title',
  introDescription: 'Mock intro desc',
  description: 'description',
  demoLink: 'https://www.mocklink.com/',
  repoLink: 'https://www.mocklink.com/',
  pictureUrls: ['https://www.mocklink.com/', 'https://www.mocklink.com/'],
};

const getProjectEntryMock = jest.fn(
  (projectEntryId: string) =>
    new Promise((resolve) => resolve(projectEntryMock))
);

jest.mock('next/router', () => ({
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
}));

beforeEach(() => {});

it('should display no existing projectEntry data if creating a new project entry', async () => {
  (getProjectEntry as any).mockImplementation(getProjectEntryMock);

  act(() => {
    render(<ProjectEntryForm projectEntryId="" />);
  });

  expect(getProjectEntryMock).toHaveBeenCalledTimes(0);

  const titleInput = await waitFor(() => screen.getByLabelText(/Title/));
  expect(titleInput.getAttribute('value')).toEqual('');

  const repoLinkInput = await waitFor(() =>
    screen.getByLabelText('Repository Link')
  );
  expect(repoLinkInput.getAttribute('value')).toEqual('');

  const demoLinkInput = await waitFor(() => screen.getByLabelText('Demo Link'));
  expect(demoLinkInput.getAttribute('value')).toEqual('');

  const introDescriptionInput = await waitFor(() =>
    screen.getByLabelText('Intro Description')
  );
  expect(introDescriptionInput.getAttribute('value')).toEqual('');

  const descriptionInput = await waitFor(() =>
    screen.getByLabelText('Description')
  );
  expect(descriptionInput.textContent).toEqual('');

  const picturesInput = await screen.findAllByAltText('uploaded').catch(() => {
    return [];
  });
  expect(picturesInput).toEqual([]);
});

it('should display project entry data from firebase if editing existing project entry', async () => {
  (getProjectEntry as any).mockImplementation(getProjectEntryMock);

  act(() => {
    render(<ProjectEntryForm projectEntryId="0" />);
  });

  expect(getProjectEntryMock).toHaveBeenCalledTimes(1);

  const titleInput = await waitFor(() => screen.getByLabelText(/Title/));
  expect(titleInput.getAttribute('value')).toEqual(projectEntryMock.title);

  const repoLinkInput = await waitFor(() =>
    screen.getByLabelText('Repository Link')
  );
  expect(repoLinkInput.getAttribute('value')).toEqual(
    projectEntryMock.repoLink
  );

  const demoLinkInput = await waitFor(() => screen.getByLabelText('Demo Link'));
  expect(demoLinkInput.getAttribute('value')).toEqual(
    projectEntryMock.demoLink
  );

  const introDescriptionInput = await waitFor(() =>
    screen.getByLabelText('Intro Description')
  );
  expect(introDescriptionInput.getAttribute('value')).toEqual(
    projectEntryMock.introDescription
  );

  const descriptionInput = await waitFor(() =>
    screen.getByLabelText('Description')
  );
  expect(descriptionInput.textContent).toEqual(projectEntryMock.description);

  const picturesInput = await screen.findAllByAltText('uploaded');
  const pictureSrcs = picturesInput.map((input) => input.getAttribute('src'));
  expect(pictureSrcs).toEqual(projectEntryMock.pictureUrls);
});
