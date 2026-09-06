שפה: עברית

# Qwen Image Editor - אפליקציית עריכת תמונות בעזרת AI

אפליקציה מלאה לעריכת תמונות תוך שימוש במודל **Qwen Image Edit Plus NSFW LoRA** מ-Hugging Face.

## ✨ תכונות

- 🎨 **עריכת תמונות יחידות** - עריכה מדויקת עם מסכה
- 📁 **עריכה קבוצתית** - עיבוד מספר תמונות בו-זמנית
- 🎯 **הנחיות טקסט** - בעזרת הנחיות טבעיות בעברית ובאנגלית
- ⚙️ **בקרות מתקדמות** - שליטה על:
  - מספר צעדי ההסקה (Inference Steps)
  - Guidance Scale לבקרה על עוצמת ההשפעה
- 🖥️ **ממשק גרפי אינטואיטיבי** - עם Drag & Drop
- ⚡ **GPU Support** - הנתמכת ל-CUDA ו-CPU
- 📱 **Responsive Design** - עובד על כל מכשירים

## 📋 דרישות מערכת

- Python 3.8+
- CUDA 11.0+ (אופציונלי, לביצועים טובים יותר)
- 8GB RAM (לפחות)
- 16GB VRAM (עבור NVIDIA GPU, רצוי)

## 🚀 התקנה והפעלה

### 1. Clone הריפוזיטורי

```bash
git clone https://github.com/sofer1445/qwen-image-editor-app.git
cd qwen-image-editor-app
```

### 2. התקנת תלויות

```bash
pip install -r requirements.txt
```

### 3. הורדת המודל

```bash
git clone https://huggingface.co/ScottzillaSystems/qwen-image-edit-plus-nsfw-lora
```

### 4. הפעלת האפליקציה

```bash
python app.py
```

הסרוור יתחיל בכתובת: `http://localhost:5000`

### 5. גישה לממשק

פתח בדפדפן: `http://localhost:5000`

(הממשק מגודלד דינמית מה-Python, או שים את `index.html` בתיקיית `static`)

## 📖 שימוש

### עריכה יחידה

1. **העלה תמונה** - לחץ או גרור תמונה
2. **העלה מסכה** - לחץ או גרור מסכה
   - שחור = אזור לעריכה
   - לבן = אזור בלי שינוי
3. **כתוב הנחיית טקסט** - תאר את השינוי הרצוי
4. **כיוונן הגדרות** (אופציונלי):
   - Inference Steps: 10-100 (ברירת מחדל: 50)
   - Guidance Scale: 1-20 (ברירת מחדל: 7.5)
5. **לחץ "ערוך תמונה"** וחכה לתוצאה
6. **הורד את התוצאה**

### עריכה קבוצתית

1. **העלה מספר תמונות** - לחץ או גרור קבוצה
2. **כתוב הנחיית טקסט** - תחול על כל התמונות
3. **לחץ "ערוך הכל"** וחכה לתוצאות
4. **הורד את התמונות**

## 🔧 API Endpoints

### GET `/health`
בדיקת בריאות הסרוור
```json
{
  "status": "healthy",
  "device": "cuda",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

### POST `/edit`
עריכת תמונה יחידה

**Parameters:**
- `image` - קובץ תמונה (required)
- `mask` - קובץ מסכה (required)
- `prompt` - הנחיית טקסט (required)
- `num_steps` - מספר צעדים (optional, default: 50)
- `guidance_scale` - Guidance scale (optional, default: 7.5)

**Response:**
```json
{
  "success": true,
  "message": "התמונה נערכה בהצלחה",
  "output_file": "output_20240101_120000.png",
  "image_size": [512, 512]
}
```

### POST `/batch-edit`
עריכה קבוצתית

**Parameters:**
- `images` - קבוצת קבוצים (required)
- `prompt` - הנחיית טקסט (required)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "filename": "image1.png",
      "output": "batch_output1.png",
      "status": "success"
    }
  ]
}
```

### GET `/output/<filename>`
הורדת קובץ פלט

## 🎯 טיפים לתוצאות טובות

1. **מסכה ברורה** - וודא שהמסכה ברורה עם ניגודיות גבוהה
2. **הנחיות ספציפיות** - כתוב הנחיות מפורשות (לא "שנה" אלא "שנה לחום")
3. **Inference Steps** - ערכים גבוהים יותר = איכות טובה יותר אך איטי יותר
4. **Guidance Scale** - ערכים גבוהים יותר = קיצוב הדוק יותר לפרומפט
5. **בחר GPU** - אם יש לך GPU, השתמש בו לביצועים טובים יותר

## 📁 מבנה הפרויקט

```
qwen-image-editor-app/
├── app.py                 # Backend Flask
├── index.html            # Frontend HTML
├── style.css             # Styling
├── script.js             # Frontend JavaScript
├── requirements.txt      # Python dependencies
├── uploads/              # Uploads folder
├── outputs/              # Outputs folder
└── README.md            # This file
```

## ⚠️ הערות חשובות

- **NSFW Content**: המודל מטופל גם בתוכן NSFW - השתמש באחריות
- **Privacy**: התמונות מעובדות ברשלך בלבד, לא נשלחות לשום שרת חיצוני
- **Performance**: הפעם הראשונה לטעינת המודל יכולה להיות איטית

## 🐛 פתרון בעיות

### "המודל לא נטען"
```bash
# בדוק שיש לך רשות כתיבה בתיקיה
# נסה להורדות ידנית של המודל:
huggingface-cli download ScottzillaSystems/qwen-image-edit-plus-nsfw-lora
```

### "CUDA Out of Memory"
- הקטן את גודל התמונה
- הקטן את Inference Steps
- השתמש ב-float16 במקום float32
- הוסף `torch.cuda.empty_cache()` ב-code

### "תמונה לא מתעדכנת"
- ודא שהמסכה והתמונה באותו גודל
- בדוק שהמסכה בפורמט L (grayscale)

## 📄 License

MIT License - ראה LICENSE file

## 🙋 Support

אם יש לך שאלות או בעיות:
1. בדוק את הלוגים ב-console
2. בדוק את `/health` endpoint
3. פתח issue ב-GitHub

## 🎓 למידה נוספת

- [Diffusers Documentation](https://huggingface.co/docs/diffusers)
- [Qwen Model Card](https://huggingface.co/ScottzillaSystems/qwen-image-edit-plus-nsfw-lora)
- [Stable Diffusion Inpainting](https://huggingface.co/docs/diffusers/using-diffusers/inpaint)

---

**עברית**: אפליקציה זו נבנתה עבור עריכת תמונות מתקדמת תוך שימוש בבינה מלאכותית. 

**English**: This application is built for advanced image editing using artificial intelligence.
