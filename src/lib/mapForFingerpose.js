// Takes hand obj and returns the 3d keypoint data as a nested array. The appropriate format for fingerpose library
export const mapForFingerpose = (hand) => {
  const keypointsArr = hand.keypoints3D;
  return keypointsArr.map((point) => {
    return [point.x, point.y, point.z];
  });
};