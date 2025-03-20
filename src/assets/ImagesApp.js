const loadImage = async (imageName) => {
    switch (imageName) {
      case "logoFcyt":
        return import("./img/fcyt.png");
      case "ohSansi":
        return import("./img/ohSansi.png")
      case "defImg":
        return import("./img/def-img.jpg");
      default:
        return import("./img/def-img.jpg");
  
    }
  };
  
  export default loadImage;
  