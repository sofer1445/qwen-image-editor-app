// משתנים גלובליים
let currentResultFile = null;
const API_URL = 'http://localhost:5000';

// פונקציות עזר
function showLoading(message = 'עיבוד התמונה...') {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingModal').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingModal').classList.add('hidden');
}

function switchTab(tabName) {
    // הסתרת כל הטאבים
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // הצגת הטאב הנבחר
    document.getElementById(tabName).classList.add('active');
    
    // עדכון כפתורים
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// בדיקת חיבור לסרוור
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            document.getElementById('status').textContent = '✅ מחובר';
            document.getElementById('device-info').textContent = `Device: ${data.device}`;
        }
    } catch (error) {
        document.getElementById('status').textContent = '❌ לא מחובר';
        console.error('שגיאה בחיבור:', error);
    }
}

// טעינת תמונה יחידה
document.getElementById('imageUploadBox').addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('imagePreview').innerHTML = 
                `<img src="${event.target.result}" alt="תמונה">`;
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop לתמונה
document.getElementById('imageUploadBox').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('imageUploadBox').classList.add('dragover');
});

document.getElementById('imageUploadBox').addEventListener('dragleave', () => {
    document.getElementById('imageUploadBox').classList.remove('dragover');
});

document.getElementById('imageUploadBox').addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('imageUploadBox').classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('imageInput').files = files;
        document.getElementById('imageInput').dispatchEvent(new Event('change'));
    }
});

// טעינת מסכה
document.getElementById('maskUploadBox').addEventListener('click', () => {
    document.getElementById('maskInput').click();
});

document.getElementById('maskInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('maskPreview').innerHTML = 
                `<img src="${event.target.result}" alt="מסכה">`;
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop למסכה
document.getElementById('maskUploadBox').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('maskUploadBox').classList.add('dragover');
});

document.getElementById('maskUploadBox').addEventListener('dragleave', () => {
    document.getElementById('maskUploadBox').classList.remove('dragover');
});

document.getElementById('maskUploadBox').addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('maskUploadBox').classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('maskInput').files = files;
        document.getElementById('maskInput').dispatchEvent(new Event('change'));
    }
});

// עדכון ערך Sliders
document.getElementById('numSteps').addEventListener('input', (e) => {
    document.getElementById('stepsValue').textContent = e.target.value;
});

document.getElementById('guidance').addEventListener('input', (e) => {
    document.getElementById('guidanceValue').textContent = e.target.value;
});

// עריכת תמונה
async function editImage() {
    const imageInput = document.getElementById('imageInput');
    const maskInput = document.getElementById('maskInput');
    const prompt = document.getElementById('prompt').value;
    
    if (!imageInput.files[0]) {
        alert('אנא בחר תמונה');
        return;
    }
    
    if (!maskInput.files[0]) {
        alert('אנא בחר מסכה');
        return;
    }
    
    if (!prompt.trim()) {
        alert('אנא הזן הנחיית טקסט');
        return;
    }
    
    showLoading('עיבוד התמונה...');
    
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('mask', maskInput.files[0]);
    formData.append('prompt', prompt);
    formData.append('num_steps', document.getElementById('numSteps').value);
    formData.append('guidance_scale', document.getElementById('guidance').value);
    
    try {
        const response = await fetch(`${API_URL}/edit`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentResultFile = data.output_file;
            document.getElementById('resultImage').innerHTML = 
                `<img src="${API_URL}/output/${data.output_file}" alt="תוצאה">`;
            document.getElementById('resultSection').classList.remove('hidden');
            hideLoading();
        } else {
            alert('שגיאה: ' + data.error);
            hideLoading();
        }
    } catch (error) {
        alert('שגיאה בחיבור לסרוור: ' + error.message);
        hideLoading();
    }
}

// הורדת תמונה
function downloadResult() {
    if (currentResultFile) {
        window.open(`${API_URL}/output/${currentResultFile}`, '_blank');
    }
}

// עריכה קבוצתית
document.getElementById('batchUploadBox').addEventListener('click', () => {
    document.getElementById('batchInput').click();
});

document.getElementById('batchInput').addEventListener('change', (e) => {
    const files = e.target.files;
    const preview = document.getElementById('batchPreview');
    preview.innerHTML = '';
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Drag and drop לעריכה קבוצתית
document.getElementById('batchUploadBox').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('batchUploadBox').classList.add('dragover');
});

document.getElementById('batchUploadBox').addEventListener('dragleave', () => {
    document.getElementById('batchUploadBox').classList.remove('dragover');
});

document.getElementById('batchUploadBox').addEventListener('drop', (e) => {
    e.preventDefault();
    document.getElementById('batchUploadBox').classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('batchInput').files = files;
        document.getElementById('batchInput').dispatchEvent(new Event('change'));
    }
});

// עריכה קבוצתית
async function batchEditImages() {
    const batchInput = document.getElementById('batchInput');
    const prompt = document.getElementById('batchPrompt').value;
    
    if (batchInput.files.length === 0) {
        alert('אנא בחר תמונות');
        return;
    }
    
    if (!prompt.trim()) {
        alert('אנא הזן הנחיית טקסט');
        return;
    }
    
    showLoading(`עיבוד ${batchInput.files.length} תמונות...`);
    
    const formData = new FormData();
    for (let file of batchInput.files) {
        formData.append('images', file);
    }
    formData.append('prompt', prompt);
    
    try {
        const response = await fetch(`${API_URL}/batch-edit`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayBatchResults(data.results);
            hideLoading();
        } else {
            alert('שגיאה: ' + data.error);
            hideLoading();
        }
    } catch (error) {
        alert('שגיאה בחיבור לסרוור: ' + error.message);
        hideLoading();
    }
}

function displayBatchResults(results) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = `result-item ${result.status}`;
        
        if (result.status === 'success') {
            div.innerHTML = `
                <img src="${API_URL}/output/${result.output}" alt="${result.filename}">
                <p><strong>${result.filename}</strong></p>
                <a href="${API_URL}/output/${result.output}" target="_blank" class="btn btn-secondary">הורדה</a>
            `;
        } else {
            div.innerHTML = `
                <p><strong>${result.filename}</strong></p>
                <p style="color: red;">שגיאה: ${result.error}</p>
            `;
        }
        
        resultsList.appendChild(div);
    });
    
    document.getElementById('batchResults').classList.remove('hidden');
}

// בדיקה ראשונית
window.addEventListener('load', () => {
    checkHealth();
    // בדיקה כל 5 שניות
    setInterval(checkHealth, 5000);
});
