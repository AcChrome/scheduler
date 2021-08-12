import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  getByDisplayValue,
  prettyDOM
} from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Click the "Save" button on that same appointment.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    // 7. Check that the element with the text "Saving" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increase the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the element with confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check the DaylistItem with the text "Monday" also has text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    // 3. Click the "Edit" button on the appointment.
    fireEvent.click(queryByAltText(appointment, "Edit"));
  
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i),
    {target: {value: "Lydia Miller-Jones"}});
  
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
  
    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving"));
  
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    // 9. Check that the DayListItem with the text "Monday" also has the same amount of spots remaining.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Chohen is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click on "edit" button on the same appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")  
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
    
    // 4. Check to see if edit mode is displayed with name Archie Cohen.
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"))

    // 6. Wait until the element with the text "Error saving" is displayed.
    await waitForElement(() => getByText(appointment, "Error saving"))

    // 7. Check to see if error message shows "Error saving".
    expect(getByText(appointment, "Error saving")).toBeInTheDocument();
  });

    it("shows the delete error when failing to delete an existing appointment", async () => {
      axios.delete.mockRejectedValueOnce();
  
      // 1. Render the Application.
      const { container, debug } = render(<Application />);
  
      // 2. Wait until Archie Chohen is displayed
      await waitForElement(() => getByText(container, "Archie Cohen"));
  
      // 3. Click on "Delete" button on the same appointment.
      const appointment = getAllByTestId(container, "appointment").find(appointment => 
        queryByText(appointment, "Archie Cohen")  
      );
      fireEvent.click(getByAltText(appointment, "Delete"));
      
      // 4. Check that the element with confirmation message is shown.
      expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
  
      // 5. Click on "Confirm" button on the delete element.
      fireEvent.click(getByText(appointment, "Confirm"))
      
      // 6. Wait until the element with the text "Error deleting" is displayed.
      await waitForElement(() => getByText(appointment, "Error deleting"))
  
      // 7. Check to see if error message shows "Error deleting".
      expect(getByText(appointment, "Error deleting")).toBeInTheDocument();
    
  });

});
