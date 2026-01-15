$QUAY_USER = "12572624"
$TAG = "1.0.0"
$IMAGES = @(
    @{ name="bookstore-frontend"; dir="frontend" },
    @{ name="bookstore-backend"; dir="backend" },
    @{ name="bookstore-db"; dir="database" },
    @{ name="bookstore-redis"; dir="redis" }
)

# إنشاء مجلد لحفظ التقارير إذا لم يكن موجوداً
$REPORT_DIR = "scan_reports"
if (-not (Test-Path $REPORT_DIR)) {
    New-Item -ItemType Directory -Path $REPORT_DIR | Out-Null
}

Write-Host "Logging into Quay.io..." -ForegroundColor Cyan
podman login quay.io

foreach ($img in $IMAGES) {
    $FULL_NAME = "quay.io/$QUAY_USER/$($img.name):$TAG"
    
    # تحديد اسم ملف التقرير لكل صورة
    $REPORT_FILE = "$REPORT_DIR/$($img.name)-report.txt"

    Write-Host "`nBuilding $($img.name)..." -ForegroundColor Yellow
    podman build -t $FULL_NAME ./$($img.dir)

    Write-Host "Pushing to Quay..." -ForegroundColor Blue
    podman push $FULL_NAME

    Write-Host "Scanning with Trivy (Saving to $REPORT_FILE)..." -ForegroundColor Green
    
    # التعديل هنا:
    # --severity: يحدد المستويات المطلوبة (مثلاً High و Critical فقط)
    # --output: يحفظ النتيجة في الملف المحدد بدلاً من طباعتها على الشاشة
    trivy image --config security/trivy-config.yaml `
                --severity HIGH,CRITICAL `
                --output $REPORT_FILE `
                $FULL_NAME
    
    Write-Host "Scan saved to $REPORT_FILE" -ForegroundColor Gray
}