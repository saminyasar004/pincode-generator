/*
 * Title: Pincode Generator
 * Description: A new pincode will generate and sent in user email address. then user can input that pincode here.
 * Author: Samin Yasar
 * Date: 14/July/2021
 */

// Global Variables

const serviceId = "gmail_004";
const templateId = "pincode_generator_004";

// DOM Selecting

const pincodeSectionEl = document.getElementById("pincodeSection");

// Parent Class

class PinCode {
    /**
     *
     * @param {html element} parentDOM - Provide the Parent element where all the created element will be appended
     * @param {string} authorName - The name of email sender
     * @param {string} serviceId - EmailJS Service Id
     * @param {string} templateId - EmailJS Template Id
     * @param {number} digit - The length of pincode what will be generated
     * @param {number} timeLimit - Time limit in seconds
     * @returns {object} - A new Object
     */
    constructor(
        parentDOM,
        authorName,
        serviceId,
        templateId,
        digit,
        timeLimit
    ) {
        this.parentDOM = parentDOM;
        this.authorName = authorName;
        this.digit = digit;
        this.serviceId = serviceId;
        this.templateId = templateId;
        this.globalSeconds = parseInt(timeLimit) || 120;

        this.userName = null;
        this.userEmail = null;

        this.currentPinCode = null;
        this.isPinCodeSent = false;
        this.intervalId = null;

        this.DOMHandler();
    }

    DOMHandler() {
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
                        id="usernameField"
                        type="text"
                        placeholder="Enter your username..."
                        autocomplete="off"
                    />
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
                <div class="authorText">
                <p>
                    build with 💜 by
                    <a target="_blank" href="https://saminyasar.netlify.app/"
                        >samin yasar</a
                    >
                </p>
            </div>
`;
        this.parentDOM.appendChild(containerEl);

        const headingH1 = document.querySelector(".heading h1");
        const formContainerEl = document.getElementById("formContainer");
        const emailField = document.getElementById("emailField");
        const usernameField = document.getElementById("usernameField");
        const btnSubmit = document.getElementById("btnSubmit");
        const formAlertEl = document.getElementById("formAlert");
        const loaderEl = document.getElementById("loader");

        this.DOMObj = {
            headingH1,
            formContainerEl,
            usernameField,
            emailField,
            btnSubmit,
            formAlertEl,
            loaderEl,
        };

        btnSubmit.addEventListener("click", this.btnSubmitHandler.bind(this));
    }

    async btnSubmitHandler() {
        try {
            if (!this.isPinCodeSent) {
                let clickedStatus = 1;
                let usernameAndEmailCurrentValue =
                    await this.inputAuthentication.call(this, clickedStatus);
                if (usernameAndEmailCurrentValue) {
                    this.userName =
                        usernameAndEmailCurrentValue.username.call(this);
                    this.userEmail = usernameAndEmailCurrentValue.email;
                    this.pincodeGenerate.call(this);
                    this.DOMObj.headingH1.textContent =
                        "A pin code will be sent to your email very soon.";
                    this.DOMObj.formContainerEl.style.display = "none";
                    this.DOMObj.loaderEl.style.display = "block";
                    let sendingEmailResponse = await this.sendEmail.call(this);
                    if (sendingEmailResponse) {
                        this.isPinCodeSent = true;
                        this.DOMObj.formContainerEl.style.display = "flex";
                        this.DOMObj.loaderEl.style.display = "none";
                        this.DOMObj.headingH1.innerHTML = `
                        a Pincode was sent in your email. this will be invalid after <span id="timerSpan">0 second</span>.
                    `;
                        this.DOMObj.emailField.value = "";
                        this.DOMObj.usernameField.remove();
                        this.DOMObj.emailField.setAttribute(
                            "placeholder",
                            "Enter your pincode..."
                        );
                        this.startTimer.call(this);
                        this.DOMObj.btnSubmit.addEventListener(
                            "click",
                            async () => {
                                clickedStatus = 2;
                                let authenticationResponse =
                                    await this.inputAuthentication.call(
                                        this,
                                        clickedStatus
                                    );
                                if (authenticationResponse) {
                                    if (
                                        parseInt(
                                            authenticationResponse.inputedPincode
                                        ) === this.currentPinCode
                                    ) {
                                        if (this.globalSeconds > 0) {
                                            this.stopTimer.call(this);
                                            this.DOMObj.formContainerEl.remove();
                                            this.DOMObj.headingH1.textContent =
                                                "Congratulations! a secret door is opening for you.";
                                        } else {
                                            this.DOMObj.formAlertEl.textContent =
                                                "This pincode is now invalid!";
                                        }
                                    } else {
                                        this.DOMObj.formAlertEl.textContent =
                                            "Oops! pincode don't match. try again.";
                                    }
                                }
                            }
                        );
                    } else {
                        this.DOMObj.headingH1.textContent = `There is an error to send your email. please try again later.`;
                        throw "There is an error found on Email sending...";
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     *
     * @param {number} clickedStatus
     * @returns {<Promise>} -
     */
    async inputAuthentication(clickedStatus) {
        try {
            if (clickedStatus === 1) {
                if (
                    this.DOMObj.emailField.value !== "" &&
                    this.DOMObj.usernameField.value !== ""
                ) {
                    if (this.DOMObj.emailField.value.includes("@")) {
                        this.DOMObj.formAlertEl.textContent = "";
                        throw {
                            username: function () {
                                let splittedValue =
                                    this.DOMObj.usernameField.value.split(" ");
                                let username = "";
                                splittedValue.forEach((el) => {
                                    username += `${el
                                        .charAt(0)
                                        .toUpperCase()}${el
                                        .slice(1)
                                        .toLowerCase()} `;
                                });
                                return username.trimEnd();
                            },
                            email: this.DOMObj.emailField.value,
                        };
                    } else {
                        this.DOMObj.formAlertEl.textContent =
                            "Email must be contains @";
                    }
                } else {
                    this.DOMObj.formAlertEl.textContent =
                        "Username & Email field cannot be empty!";
                }
            } else if (clickedStatus === 2) {
                if (this.DOMObj.emailField.value !== "") {
                    this.DOMObj.formAlertEl.textContent = "";
                    throw {
                        inputedPincode: this.DOMObj.emailField.value,
                    };
                } else {
                    this.DOMObj.formAlertEl.textContent =
                        "pincode field cannot be empty.";
                }
            }
        } catch (err) {
            return err;
        }
    }

    async pincodeGenerate() {
        let max = "";
        let min = "1";
        for (let i = 1; i <= this.digit; i++) {
            max += "9";
            if (i !== this.digit) {
                min += "0";
            }
        }
        max = parseInt(max);
        min = parseInt(min);
        this.currentPinCode = Math.floor(Math.random() * (max - min) + min);
    }

    async sendEmail() {
        try {
            const allParams = {
                author_name: this.authorName,
                user_name: this.userName,
                user_email: this.userEmail,
                pin_code: this.currentPinCode,
            };
            await emailjs
                .send(this.serviceId, this.templateId, allParams)
                .then((res) => {
                    console.log(`Success: ${res.status}`);
                    throw { status: res.status, allParams };
                });
        } catch (err) {
            return err.status;
        }
    }

    startTimer() {
        this.intervalId = setInterval(() => {
            if (this.globalSeconds > 0) {
                this.globalSeconds--;
                let timeRecords = {
                    seconds: this.globalSeconds,
                };
                this.updateDisplay.call(this, timeRecords);
            } else {
                this.stopTimer.call(this);
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.intervalId);
    }

    /**
     *
     * @param {object} timeRecords - all time record in this object property (minutes, seconds)
     */
    updateDisplay(timeRecords) {
        document.querySelector("#timerSpan").textContent =
            timeRecords.seconds < 10
                ? `0${timeRecords.seconds} second`
                : `${timeRecords.seconds} seconds`;
    }
}

const test1 = new PinCode(
    pincodeSectionEl,
    "Samin Yasar",
    serviceId,
    templateId,
    4,
    120
);
