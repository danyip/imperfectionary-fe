export const mapForFingerpose = (hand) => {
  const keypointsArr = hand.keypoints3D;
  return keypointsArr.map((point) => {
    return [point.x, point.y, point.z];
  });
};