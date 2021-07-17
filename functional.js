/*
 * Title: Pincode Generator
 * Description:
 * Author: Samin Yasar
 * Date: 14/July/2021
 */

// Global Variables

const serviceId = "gmail_004";
const templateId = "template_wkar33p";

const pincodeLength = 4;

// Configuration Variables
let isPincodeSent = false;

const pincodeSectionEl = document.getElementById("pincodeSection");
const containerEl = document.createElement("div");
containerEl.setAttribute("class", "container");
containerEl.innerHTML = `
    <div class="heading">
                    <h1>
                        wanna get a brand new pincode? provide your email below
                        👇
                    </h1>
                </div>
                <div id="formContainer" class="form">
                    <input
                        id="emailField"
                        type="text"
                        placeholder="Enter your email address..."
                        autocomplete="off"
                    />
                    <input id="btnSubmit" type="submit" value="Submit" />
                    <p id="formAlert"></p>
                </div>
                <div id="loader">
                    <div class="spinner">
                        <div class="round1"></div>
                        <div class="round2"></div>
                        <div class="round3"></div>
                    </div>
                </div>
`;

pincodeSectionEl.appendChild(containerEl);

// DOM Selecting
const headingH1 = document.querySelector(".heading h1");
const formContainerEl = document.getElementById("formContainer");
const emailField = document.getElementById("emailField");
const btnSubmit = document.getElementById("btnSubmit");
const formAlertEl = document.getElementById("formAlert");
const loaderEl = document.getElementById("loader");

// Event Listeners

btnSubmit.addEventListener("click", async () => {
    try {
        if (!isPincodeSent) {
            const userEmail = await emailFieldAuthentication();
            if (userEmail) {
                formContainerEl.style.display = "none";
                loaderEl.style.display = "block";
                let sendingEmailResponse = await sendEmail(userEmail);
                if (sendingEmailResponse) {
                    isPincodeSent = true;
                    formContainerEl.style.display = "flex";
                    loaderEl.style.display = "none";
                    headingH1.textContent = "Enter your pincode below 👇";
                    emailField.value = "";
                    emailField.setAttribute(
                        "placeholder",
                        "Enter your pincode..."
                    );
                    console.log(sendingEmailResponse);
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
});

// Functionalities

async function emailFieldAuthentication() {
    if (emailField.value !== "") {
        if (emailField.value.includes("@")) {
            formAlertEl.textContent = "";
            headingH1.textContent =
                "A pin code will be sent to your email very soon. check it.";
            return emailField.value;
        } else {
            formAlertEl.textContent = "Email must be contains @";
        }
    } else {
        formAlertEl.textContent = "Email field cannot be empty!";
    }
}

async function pincodeGenerator(digit) {
    let max = "";
    let min = "1";
    for (let i = 1; i <= digit; i++) {
        max += "9";
        if (i !== digit) {
            min += "0";
        }
    }
    max = parseInt(max);
    min = parseInt(min);
    return Math.floor(Math.random() * (max - min) + min);
}

async function sendEmail(email) {
    try {
        const pin_code = await pincodeGenerator(pincodeLength);
        const tempParams = {
            author_name: "saminyasar004",
            user_name: email.split("@")[0],
            user_email: email,
            pin_code,
        };
        await emailjs.send(serviceId, templateId, tempParams).then((res) => {
            throw tempParams;
        });
    } catch (err) {
        return err;
    }
}
