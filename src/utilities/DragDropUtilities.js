export const setNewOffset = (noteCard, mouseMoveDirection = { x: 200, y: 120 }) => {
    const offsetLeft=noteCard.offsetLeft-mouseMoveDirection.x
    const offsetTop = noteCard.offsetTop - mouseMoveDirection.y
    
    return (
        {
            x:offsetLeft<200?200:offsetLeft,
            y:offsetTop<120?120:offsetTop
        }
    )
}

export const autoHeightAdjust = (textAreaRef) => {
        const { current } = textAreaRef
        current.style.height = "auto"; // Reset the height
        current.style.height = textAreaRef.current.scrollHeight + "px";
}

export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 999;
    Array.from(document.getElementsByClassName("note-card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};