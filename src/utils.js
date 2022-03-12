export const drawHand = (predicitons, ctx) => {
  if (predicitons.length>0) {
    predicitons.forEach((predicition)=>{
      const landmarks = predicition.landmarks;

      for (let i=0; i<landmarks.length; i++){
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI)
        ctx.fillStyle = "red";
        ctx.fill()
      }
    })
  }

}