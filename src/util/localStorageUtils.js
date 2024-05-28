export const getProfileImageFromLocalStorage = () => {
  return localStorage.getItem("profileImage");
};

export const setProfileImageToLocalStorage = (image) => {
  localStorage.setItem("profileImage", image);
  window.dispatchEvent(new Event("profileImageChange"));
};

export const getProfileNameFromLocalStorage = () => {
  return localStorage.getItem("profileName");
};

export const setProfileNameToLocalStorage = (name) => {
  localStorage.setItem("profileName", name);
  window.dispatchEvent(new Event("profileNameChange"));
};
