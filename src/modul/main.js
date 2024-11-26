const generatedId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 28;
    let id = '';
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
    }
    return id;
}

export default generatedId;
export const avatar = "https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
