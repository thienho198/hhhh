module.exports = {
    LANGUAGE_REGEX: /^(en|EN|vi|VI)$/,
    PHONE_REGEX: /^(09[0|1|2|3|4|6|7|8|9]|08[1|2|3|4|5|6|8|9]|07[0|6|7|8|9]|05[6|8|9]|03[2|3|4|5|6|7|8|9])+([0-9]{7})$\b/,
    EMAIL_REGEX: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
}