const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImage;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImage);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("/generate-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: userPrompt, quantity: userImgQuantity }),
        });

        if (!response.ok) throw new Error("Failed to generate AI images.");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating = false;
    }
}

const handleImageGeneration = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = parseInt(e.srcElement[1].value);

    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="AI generated image">
            <a class="download-btn" href="#">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);
