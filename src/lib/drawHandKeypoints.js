
export const drawHandKeypoints = (predictions, ctx) => {
  // console.log(ctx);

  if (predictions.length>0) {
    predictions.forEach((prediction)=>{
      const keypoints = prediction.keypoints;

      for (let i=0; i<keypoints.length; i++){
        const x = ((keypoints[i].x - ctx.canvas.offsetWidth - ctx.canvas.offsetLeft) *-1);
        const y = keypoints[i].y;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 3 * Math.PI)
        ctx.fillStyle = prediction.handedness === 'Left'? "red" : "blue"
        ctx.fill()
      }
    })
  }
}

