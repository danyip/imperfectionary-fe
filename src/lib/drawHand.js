
export const drawHand = (predictions, ctx) => {
  // console.log(ctx);

  if (predictions.length>0) {
    predictions.forEach((prediction)=>{
      const keypoints = prediction.keypoints;

      for (let i=0; i<keypoints.length; i++){
        const x = ((keypoints[i].x - ctx.canvas.offsetWidth - ctx.canvas.offsetLeft) *-1) *0.3;
        const y = keypoints[i].y * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 3 * Math.PI)
        ctx.fillStyle = prediction.handedness === 'Left'? "red" : "blue"
        ctx.fill()
      }
    })
  }
}

