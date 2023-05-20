let colorInput = document.getElementById('color');
let title = document.getElementById('title');
let rgbOutput = document.getElementById('rgb');

colorInput.addEventListener('input', () =>{
  let selectedColor = colorInput.value;
  let rgb = hexToRgb(selectedColor);
  
  let rgbCode = `background-color: (${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  rgbOutput.textContent = rgbCode;
      document.body.style.backgroundColor = selectedColor;

      if (rgb.r < 112) {
        rgbOutput.style.color = '#ffffff';
        title.style.color = '#ffffff';
      } else {
        rgbOutput.style.color = '#000000';
        title.style.color = '#000000';

      }
});



function hexToRgb(hex) {
    hex = hex.replace('#', '');
   
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b }
}
