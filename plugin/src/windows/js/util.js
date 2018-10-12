function getColorFromHexString(colorString) {
    if(colorString){
        colorString = colorString.toString().replace('#', '');
        if (colorString && colorString.length === 6) {
            const red = parseInt(colorString.substring(0, 2), 16);
            const green = parseInt(colorString.substring(2, 4), 16);
            const blue = parseInt(colorString.substring(4, 6), 16);
            return `rgb(${red}, ${green}, ${blue})`;
        } else if (colorString && colorString.length === 8) {
            const alpha = parseInt(colorString.substring(0, 2), 16);
            const red = parseInt(colorString.substring(2, 4), 16);
            const green = parseInt(colorString.substring(4, 6), 16);
            const blue = parseInt(colorString.substring(6, 8), 16);
            return `rgba(${red}, ${green}, ${blue}, ${alpha / 100})`;
        }
        return 'rgba(255, 255, 255, 0)';
    }
    return 'rgba(255, 255, 255, 0)';
}