export const getProfileImageFromLocalStorage = () => {
  return localStorage.getItem("profileImage");
};

export const setProfileImageToLocalStorage = (image) => {
  localStorage.setItem("profileImage", image);
  window.dispatchEvent(new Event("profileImageChange"));
};
