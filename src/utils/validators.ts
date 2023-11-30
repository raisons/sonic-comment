
const regEmail = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

export function validateEmail(email: string): boolean {
    return regEmail.test(email);
}

export function validateUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}
