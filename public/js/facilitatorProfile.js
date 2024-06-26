/**
 * User Profile Management
 *
 * This JavaScript file handles the management of user profiles, including editing user information and changing passwords.
 * It listens for the DOMContentLoaded event to ensure all DOM elements are loaded before executing JavaScript.
 * It retrieves user information asynchronously, displays it on the page, and provides functionality to edit user information and change passwords.
 * Password validation and error handling are also implemented.
 *
 * External Dependencies:
 * - scaleElements.js: Provides functions for scaling elements.
 * - passwordValidation.js: Provides functions for password validation.
 *
 * Functions:
 * - fetchUserInformation(): Fetches user information from the server.
 * - saveEdits(data): Saves edited user information to the server.
 * - changePasswordRequest(currentPassword, newPassword): Sends a request to change the user's password to the server.
 */

import { scaleUpElement, resetScaleElement } from "./utils/scaleElements.js";
import { isPasswordValid } from "./utils/passwordValidation.js";

document.addEventListener("DOMContentLoaded", async () => {
  let originalUserDetailsDiv; // Variable to store the original state of userInformationDiv
  const editUserInformationButton = document.getElementById("editButton");
  const userInformationDiv = document.getElementById("userInformationDiv");
  const changePasswordButton = document.getElementById("changePasswordButton");
  const userData = await fetchUserInformation();
  let editDisabled = false;
  let editing = false;

  const urlParams = new URLSearchParams(window.location.search);
  const passwordReset = urlParams.get("passwordReset");

  if (passwordReset) {
    displayChangePassword();
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      console.log(button);
      if (button.id != "saveButton") {
        button.disabled = true;
      }
    });
  }

  changePasswordButton.addEventListener("mouseover", () =>
    scaleUpElement(changePasswordButton),
  );

  changePasswordButton.addEventListener("mouseleave", () =>
    resetScaleElement(changePasswordButton),
  );

  if (userInformationDiv) {
    displayUserInformation(userData);
    const userDetailsDiv = document.getElementById("userDetailsDiv");
    originalUserDetailsDiv = userDetailsDiv.cloneNode(true); // Clone the original userInformationDiv
  } else {
    console.log("There was an error accessing the userInformationDiv");
  }

  if (editUserInformationButton) {
    editUserInformationButton.addEventListener("mouseover", () => {
      scaleUpElement(editUserInformationButton, 2.0);
    });

    editUserInformationButton.addEventListener("mouseleave", () => {
      resetScaleElement(editUserInformationButton, 1.5);
    });

    editUserInformationButton.addEventListener("click", () => {
      if (userInformationDiv && !editing && !editDisabled) {
        editing = true;
        displayEditUserInformation(userInformationDiv);
      } else {
        console.log("There was an error displaying the edit user information.");
      }
    });
  } else {
    console.log("No edit button");
  }

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", () => {
      console.log("Change Password Clicked");
      displayChangePassword();
    });
  }

  function restoreUserInformationDiv() {
    console.log("Restoring userInformationDiv");
    const userDetailsDiv = document.getElementById("userDetailsDiv");
    const buttonDiv = document.getElementById("buttonDiv");
    const passwordDiv = document.getElementById("passwordDiv");
    const parent = userDetailsDiv.parentNode;

    if (buttonDiv && !passwordDiv) {
      parent.removeChild(buttonDiv);
    } else if (passwordDiv) {
      userDetailsDiv.removeChild(passwordDiv);
    }

    parent.replaceChild(originalUserDetailsDiv.cloneNode(true), userDetailsDiv); // Restore userInformationDiv to its original state
    let changePasswordButton = document.getElementById("changePasswordButton");
    console.log(changePasswordButton);
    changePasswordButton.addEventListener("click", () => {
      console.log("Change Password Clicked");
      displayChangePassword();
    });
    changePasswordButton.addEventListener("mouseover", () =>
      scaleUpElement(changePasswordButton),
    );

    changePasswordButton.addEventListener("mouseleave", () =>
      resetScaleElement(changePasswordButton),
    );
    console.log(changePasswordButton);
  }

  function displayUserInformation(userData) {
    try {
      if (!userData) {
        console.log("No user data available");
        // Todo: display an error message
        return;
      }

      const contentDiv = document.getElementById("contentDiv");
      const firstNameSpan = document.getElementById("firstName");
      const lastNameSpan = document.getElementById("lastName");
      const primaryEmailSpan = document.getElementById("primaryEmail");
      const secondaryEmailSpan = document.getElementById("secondaryEmail");
      const facilitySpan = document.getElementById("facility");
      const phoneSpan = document.getElementById("phone");

      if (userData.first_name) {
        firstNameSpan.innerText = userData.first_name;
      }

      if (userData.last_name) {
        lastNameSpan.innerText = userData.last_name;
      }

      if (userData.email) {
        if (userData.email.length < 3) {
          editDisabled = true;
          contentDiv.insertBefore(
            displayErrorMessage(
              "Primary Email value incorrect, Please contact your systems administrator",
            ),
            contentDiv.firstChild,
          );
        } else {
          primaryEmailSpan.innerText = userData.email;
        }
      } else {
        editDisabled = true;
        contentDiv.insertBefore(
          displayErrorMessage(
            "Primary Email missing, Please contact your systems administrator",
          ),
          contentDiv.firstChild,
        );
        primaryEmailSpan.innerText = "This should never happen";
      }

      if (userData.secondary_email) {
        secondaryEmailSpan.innerText = userData.secondary_email;
      } else {
        secondaryEmailSpan.innerText = "Add a secondary email";
      }

      if (userData.facility) {
        if (userData.facility.lenght < 2) {
          editDisabled = true;
          contentDiv.insertBefore(
            displayErrorMessage(
              "Incorrect facility value, Please contact your systems administrator",
            ),
            contentDiv.firstChild,
          );
        } else {
          facilitySpan.innerText = userData.facility;
        }
      } else {
        editDisabled = true;
        contentDiv.insertBefore(
          displayErrorMessage(
            "Facility missing, Please contact your systems administrator",
          ),
          contentDiv.firstChild,
        );
        facilitySpan.innerText =
          "Facility information missing, please contact your administrator";
      }

      if (userData.phone) {
        phoneSpan.innerText = userData.phone;
      } else {
        phoneSpan.innerText = "This should never happen";
      }
    } catch (error) {
      console.log(`Error fetching the user information: ${error}`);
    }
  }

  function displayEditUserInformation(currentDiv) {
    const firstNameSpan = currentDiv.querySelector("#firstName");
    const lastNameSpan = currentDiv.querySelector("#lastName");
    const primaryEmailSpan = currentDiv.querySelector("#primaryEmail");
    const secondaryEmailSpan = currentDiv.querySelector("#secondaryEmail");
    const phoneSpan = currentDiv.querySelector("#phone");
    const passwordDiv = currentDiv.querySelector("#passwordDiv");
    passwordDiv.parentNode.removeChild(passwordDiv);

    let firstName;
    let lastName;
    let primaryEmail;
    let secondaryEmail;
    let phone;

    if (firstNameSpan) {
      firstName = firstNameSpan.textContent;
      const firstNameInputField = createInputField(firstName, "text");
      firstNameInputField.id = "firstName";
      firstNameInputField.required = true;
      firstNameSpan.parentNode.replaceChild(firstNameInputField, firstNameSpan);
    } else {
      const parent = currentDiv.parentNode;
      parent.insertBefore(
        displayErrorMessage(
          "First Name missing, Please contact your systems administrator",
        ),
        parent.firstChild,
      );
      console.log("No first name element");
    }

    if (lastNameSpan) {
      lastName = lastNameSpan.textContent;
      console.log(lastName);
      const lastNameInputField = createInputField(lastName, "text");
      lastNameInputField.id = "lastName";
      lastNameInputField.required = true;
      lastNameSpan.parentNode.replaceChild(lastNameInputField, lastNameSpan);
    } else {
      const parent = currentDiv.parentNode;
      parent.insertBefore(
        displayErrorMessage(
          "Last Name missing, Please contact your systems administrator",
        ),
        parent.firstChild,
      );
      console.log("No last name element");
    }

    if (primaryEmailSpan) {
      primaryEmail = primaryEmailSpan.textContent;
      console.log(primaryEmail);
      const primaryEmailInputField = createInputField(primaryEmail, "email");
      primaryEmailInputField.id = "primaryEmail";
      primaryEmailInputField.required = true;
      primaryEmailSpan.parentNode.replaceChild(
        primaryEmailInputField,
        primaryEmailSpan,
      );
    } else {
      const parent = currentDiv.parentNode;
      parent.insertBefore(
        displayErrorMessage(
          "Primary Email missing, Please contact your systems administrator",
        ),
        parent.firstChild,
      );
      console.log("No primary email element");
    }

    if (secondaryEmailSpan) {
      secondaryEmail = secondaryEmailSpan.textContent;
      if (secondaryEmail.startsWith("Add ")) {
        secondaryEmail = "";
      }
      const secondaryEmailInputField = createInputField(
        secondaryEmail,
        "email",
      );
      secondaryEmailInputField.id = "secondaryEmail";
      secondaryEmailSpan.parentNode.replaceChild(
        secondaryEmailInputField,
        secondaryEmailSpan,
      );
    }

    if (phoneSpan) {
      phone = phoneSpan.textContent;
      console.log(phoneSpan);
      const phoneInputField = createInputField(phone, "tel");
      phoneInputField.id = "phone";
      phoneInputField.required = true;
      phoneInputField.addEventListener("input", function (event) {
        const isBackspace = event.inputType === "deleteContentBackward";

        if (!isBackspace) {
          let inputValue = event.target.value.replace(/\D/g, "");

          if (inputValue.length > 0) {
            inputValue =
              "(" + inputValue.substring(0, 3) + ") " + inputValue.substring(3);
          }

          if (inputValue.length > 8) {
            inputValue =
              inputValue.substring(0, 9) + "-" + inputValue.substring(9);
          }

          if (inputValue.length > 14) {
            inputValue = inputValue.substring(0, 14);
          }

          event.target.value = inputValue;
        }
      });

      phoneSpan.parentNode.replaceChild(phoneInputField, phoneSpan);
    } else {
      const parent = currentDiv.parentNode;
      parent.insertBefore(
        displayErrorMessage(
          "Phone Number missing, Please contact your systems administrator",
        ),
        parent.firstChild,
      );
      console.log("Phone number missing");
    }
    currentDiv.appendChild(displayButtons());
  }

  function displayChangePassword() {
    let currentPassword = "";
    let newPassword = "";
    let confirmNewPassword = "";

    const passwordDiv = document.getElementById("passwordDiv");
    let changePasswordButton = document.getElementById("changePasswordButton");
    const currPassLabel = createLabel("Current Password:");
    const currPassInput = createInputField(currentPassword, "password");
    const newPassLabel = createLabel("New Password");
    const newPasswordInput = createInputField(newPassword, "password");
    const confirmNewLabel = createLabel("Confirm New Password");
    const confirmNewPasswordInput = createInputField(
      confirmNewPassword,
      "password",
    );

    currPassLabel.classList.add("appear-transition");
    currPassInput.classList.add("appear-transition");
    currPassInput.setAttribute("id", "currPass");
    passwordDiv.appendChild(currPassLabel);
    passwordDiv.appendChild(currPassInput);

    newPassLabel.classList.add("appear-transition");
    newPasswordInput.classList.add("appear-transition");
    newPasswordInput.setAttribute("id", "newPass");
    passwordDiv.appendChild(newPassLabel);
    passwordDiv.appendChild(newPasswordInput);

    confirmNewLabel.classList.add("appear-transition");
    confirmNewPasswordInput.classList.add("appear-transition");
    confirmNewPasswordInput.setAttribute("id", "confirmPass");
    passwordDiv.appendChild(confirmNewLabel);
    passwordDiv.appendChild(confirmNewPasswordInput);

    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("id", "buttonDiv");
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "space-between";

    const buttons = createButtons(false);

    for (const button of buttons) {
      button.addEventListener("mouseover", () => scaleUpElement(button));
      button.addEventListener("mouseleave", () => resetScaleElement(button));
      buttonDiv.appendChild(button);
    }
    passwordDiv.appendChild(buttonDiv);

    passwordDiv.removeChild(changePasswordButton);
    // Apply the transition effect after a short delay to trigger the animation
    setTimeout(() => {
      currPassLabel.style.opacity = 1;
      currPassInput.style.opacity = 1;
      newPassLabel.style.opacity = 1;
      newPasswordInput.style.opacity = 1;
      confirmNewLabel.style.opacity = 1;
      confirmNewPasswordInput.style.opacity = 1;
    }, 1);
  }

  function createLabel(text) {
    const label = document.createElement("label");
    label.textContent = text;
    return label;
  }

  function createInputField(text, inputType) {
    const inputField = document.createElement("input");
    inputField.type = inputType;
    inputField.value = text;
    inputField.classList.add("generic-input");
    return inputField;
  }

  function createButtons(edit = true) {
    const buttons = [];
    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.classList.add("cancel-button");

    cancelButton.addEventListener("click", () => {
      editing = false;
      restoreUserInformationDiv();
      console.log("Cancel Button Clicked");
    });

    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save";
    saveButton.classList.add("save-button");
    saveButton.setAttribute("id", "saveButton");

    saveButton.addEventListener("click", () => {
      if (edit) {
        if (validateInputs()) {
          const inputData = getInputData();
          saveEdits(inputData);
        } else {
          console.log("Validation Failed");
        }
      } else {
        const contentDiv = document.getElementById("contentDiv");
        const currentPassword = document.getElementById("currPass").value;
        const newPassword = document.getElementById("newPass").value;
        const confirmPassword = document.getElementById("confirmPass").value;

        const contentChildren = Array.from(contentDiv.children);
        const errorDivs = contentChildren.filter(
          (child) => child.id === "errorDiv",
        );

        for (let i = 0; i < errorDivs.length; i++) {
          contentDiv.removeChild(errorDivs[i]);
        }

        if (currentPassword === newPassword) {
          const contentDiv = document.getElementById("contentDiv");
          contentDiv.insertBefore(
            displayErrorMessage("New password can not be the same as old."),
            contentDiv.firstChild,
          );
        } else {
          const passwordsMatch = comparePasswords(newPassword, confirmPassword);

          if (passwordsMatch) {
            const passwordChangeMessage = changePasswordRequest(
              currentPassword,
              newPassword,
            );

            if (passwordChangeMessage != null) {
              const contentDiv = document.getElementById("contentDiv");
              contentDiv.insertBefore(
                displaySuccessMessage("Password Updated"),
                contentDiv.firstChild,
              );

              window.location.replace("./facilitator_profile.php");
            } else {
              const contentDiv = document.getElementById("contentDiv");
              contentDiv.insertBefore(
                displayErrorMessage("Password could not be updated"),
                contentDiv.firstChild,
              );
            }
          } else {
            const contentDiv = document.getElementById("contentDiv");
            contentDiv.insertBefore(
              displayErrorMessage("Passwords did not match"),
              contentDiv.firstChild,
            );
          }
        }
      }
    });

    buttons.push(cancelButton);
    buttons.push(saveButton);
    return buttons;
  }

  function comparePasswords(newPassword, confirmPassword) {
    console.log(newPassword);
    console.log(confirmPassword);
    if (isPasswordValid(newPassword) && newPassword === confirmPassword) {
      console.log("PASS MATCH");
      return true;
    }
    return false;
  }

  function displayButtons() {
    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("id", "buttonDiv");
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "space-between";

    const buttons = createButtons();

    for (const button of buttons) {
      button.addEventListener("mouseover", () => scaleUpElement(button));
      button.addEventListener("mouseleave", () => resetScaleElement(button));
      buttonDiv.appendChild(button);
    }

    return buttonDiv;
  }

  function validateInputs() {
    const primaryEmailInput = document.querySelector("#primaryEmail");
    console.log(primaryEmailInput);
    const phoneInput = document.querySelector("#phone");

    if (primaryEmailInput && !validateEmail(primaryEmailInput.value)) {
      console.log("failed here 1");
      return false;
    }

    if (phoneInput && !validatePhoneNumber(phoneInput.value)) {
      console.log("failed here");
      return false;
    }

    return true;
  }

  function validateEmail(email) {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhoneNumber(phone) {
    // Phone number validation logic
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  }

  function getInputData() {
    const firstNameInput = document.querySelector("#firstName");
    const lastNameInput = document.querySelector("#lastName");
    const primaryEmailInput = document.querySelector("#primaryEmail");
    const secondaryEmailInput = document.querySelector("#secondaryEmail");
    const phoneInput = document.querySelector("#phone");

    console.log(primaryEmailInput.value);

    return {
      firstName: firstNameInput ? firstNameInput.value : "",
      lastName: lastNameInput ? lastNameInput.value : "",
      primaryEmail: primaryEmailInput ? primaryEmailInput.value : "",
      secondaryEmail: secondaryEmailInput ? secondaryEmailInput.value : "",
      phone: phoneInput ? phoneInput.value : "",
    };
  }
});

function displayErrorMessage(message) {
  const errorMessage = document.createElement("p");
  errorMessage.innerText = message;
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute("id", "errorDiv");
  errorDiv.appendChild(errorMessage);

  return errorDiv;
}

function displaySuccessMessage(message) {
  const successMessage = document.createElement("p");
  successMessage.innerText = message;
  const successDiv = document.createElement("div");
  successDiv.setAttribute("id", "successDiv");
  successDiv.appendChild(successMessage);

  return successDiv;
}

async function fetchUserInformation() {
  try {
    const requestData = {};
    const url = "../../../includes/get_profile_info.php";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data["success"] === false) {
      return null;
    }

    // Return the user data
    return data["data"];
  } catch (error) {
    console.log(`Error in facilitatorProfile: ${error}`);
    return [];
  }
}

async function saveEdits(data) {
  const requestData = data;

  if (!requestData) {
    const contentDiv = document.getElementById("contentDiv");
    contentDiv.insertBefore(
      displayErrorMessage(
        "Something Went Wrong, Please contact your systems administrator.",
      ),
      contentDiv.firstChild,
    );
    return null;
  }

  try {
    const url = "../../includes/facilitator_profile/save_user_info.php";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.log("Response NOT OK");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData["success"] === false) {
      return null;
    }

    // Return the user data
    if (responseData["success"] == true) {
      location.reload();
    }
    return responseData["message"];
  } catch (error) {
    console.log(error);
  }
}

async function changePasswordRequest(currentPassword, newPassword) {
  const url = "../../includes/facilitator_profile/change_password.php";
  const requestData = {
    newPassword: newPassword,
    currentPassword: currentPassword,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData["success"] === false) {
      return null;
    }

    return responseData["message"];
  } catch (error) {
    console.log(error);
  }
}
