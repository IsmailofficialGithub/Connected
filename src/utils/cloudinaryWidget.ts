declare global {
  interface Window {
    cloudinary: any;
  }
}

export const openCloudinaryWidget = (
  onSuccess: (result: any) => void,
  onError: (error: any) => void,
) => {
  if (!window.cloudinary) {
    // Load Cloudinary widget script
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.onload = () => initWidget();
    document.head.appendChild(script);
  } else {
    initWidget();
  }

  function initWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "data-transfer", // You'll need to create this preset
        folder: "data-transfer",
        resourceType: "auto",
        maxFileSize: 100000000, // 100MB
        maxVideoFileSize: 100000000,
        sources: ["local", "camera", "url"],
        showAdvancedOptions: false,
        cropping: false,
        multiple: false,
        defaultSource: "local",
        styles: {
          palette: {
            window: "#FFFFFF",
            sourceBg: "#F4F4F5",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            inactiveTabIcon: "#69778A",
            menuIcons: "#0078FF",
            link: "#0078FF",
            action: "#FF620C",
            inProgress: "#0078FF",
            complete: "#20B832",
            error: "#EA2727",
            textDark: "#000000",
            textLight: "#FFFFFF",
          },
        },
        clientAllowedFormats: [
          "mp4",
          "mov",
          "avi",
          "mkv",
          "webm",
          "jpg",
          "png",
          "gif",
          "pdf",
          "doc",
          "docx",
        ],
        maxResults: 1,
      },
      (error: any, result: any) => {
        if (error) {
          onError(error);
          return;
        }

        if (result.event === "success") {
          onSuccess(result.info);
        }
      },
    );

    widget.open();
  }
};
