export const getRegex = (type) => {
    switch (type) {
        case 'safeInputs':
            // return /^[a-zA-Z0-9\s\-_.]*$/
            return /^[a-zA-Z0-9\s\-_.'",?&$₹()]*$/
        case 'safeAccountNameInpute':
            // return /^[a-zA-Z0-9\s\-_.]*$/
            return /^[a-z0-9_]*$/
        case 'email':
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        case 'phone':
            return /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
        // return /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
        case 'password':
            return /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
        case 'float':
            return /^-?\d+(\.\d+)?$/
        default:
            return /^[a-zA-Z0-9\s\-_.]*$/
    }
}

export const getRegexError = (type) => {
    switch (type) {
        case 'safeInputs':
            return "Inputs can only contain alphanumeric characters, spaces, hyphens, commas,  single quotes,double quotes, underscores, and dots."
        case 'safeAccountNameInpute':
            return "Inputs can only contain lowercase letters, numbers, and underscores"
        case 'email':
            return "Invalide Email!"
        case 'phone':
            return "Invalid Phone Number"
        case 'password':
            return "Invalid Phone Password"
        case 'float':
            return "Invalid number"
        default:
            return /^[a-zA-Z0-9\s\-_.]*$/
    }
}