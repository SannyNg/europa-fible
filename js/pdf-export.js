/**
 * Europa Überlebens-Fibel - PDF Export
 */

document.addEventListener('DOMContentLoaded', () => {
    initPdfExport();
});

function initPdfExport() {
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => generatePdf());
    }

    const downloadFullBtn = document.getElementById('download-full-pdf');
    if (downloadFullBtn) {
        downloadFullBtn.addEventListener('click', (e) => {
            e.preventDefault();
            generatePdf();
        });
    }
}

async function generatePdf() {
    showLoading();

    try {
        if (typeof html2pdf === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }

        const element = document.querySelector('.chapters-overview');
        const lang = window.i18n?.getCurrentLanguage() || 'de';

        const opt = {
            margin: 10,
            filename: `europa-survival-guide-${lang}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error('PDF error:', error);
        alert('PDF konnte nicht erstellt werden.');
    } finally {
        hideLoading();
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function showLoading() {
    const el = document.createElement('div');
    el.id = 'pdf-loading';
    el.innerHTML = '<div class="pdf-spinner"></div><p>PDF wird erstellt...</p>';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;z-index:10000';
    document.body.appendChild(el);

    const style = document.createElement('style');
    style.textContent = '.pdf-spinner{width:50px;height:50px;border:3px solid rgba(255,255,255,0.3);border-top-color:#daa520;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}';
    el.appendChild(style);
}

function hideLoading() {
    document.getElementById('pdf-loading')?.remove();
}
