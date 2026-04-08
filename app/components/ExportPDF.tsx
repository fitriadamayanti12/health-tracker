'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportPDFProps {
    records: any[];
    symptoms: any[];
}

export default function ExportPDF({ records, symptoms }: ExportPDFProps) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Laporan Kesehatan', 14, 20);
        doc.setFontSize(10);
        doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

        // Statistik Gula Darah
        const sugarValues = records.map(r => r.blood_sugar).filter(Boolean);
        const avgSugar = sugarValues.length > 0
            ? Math.round(sugarValues.reduce((a, b) => a + b, 0) / sugarValues.length)
            : 0;
        const maxSugar = sugarValues.length > 0 ? Math.max(...sugarValues) : 0;
        const minSugar = sugarValues.length > 0 ? Math.min(...sugarValues) : 0;

        doc.setFontSize(14);
        doc.text('A. Ringkasan Gula Darah', 14, 45);
        doc.setFontSize(10);
        doc.text(`- Rata-rata: ${avgSugar} mg/dL`, 14, 55);
        doc.text(`- Tertinggi: ${maxSugar} mg/dL`, 14, 62);
        doc.text(`- Terendah: ${minSugar} mg/dL`, 14, 69);
        doc.text(`- Total catatan: ${records.length}`, 14, 76);

        // Tabel Riwayat Gula Darah
        doc.setFontSize(14);
        doc.text('B. Riwayat Gula Darah', 14, 90);

        const tableData = records.slice(0, 20).map(record => [
            new Date(record.recorded_at).toLocaleDateString('id-ID'),
            `${record.blood_sugar} mg/dL`,
            record.systolic && record.diastolic ? `${record.systolic}/${record.diastolic}` : '-',
            record.notes || '-'
        ]);

        autoTable(doc, {
            startY: 95,
            head: [['Tanggal', 'Gula Darah', 'Tekanan Darah', 'Catatan']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
        });

        // Gejala
        const currentY = (doc as any).lastAutoTable?.finalY + 10 || 130;
        doc.setFontSize(14);
        doc.text('C. Ringkasan Gejala (2 minggu terakhir)', 14, currentY);

        const symptomCount = {
            lelah: symptoms.filter(s => s.fatigue).length,
            haus: symptoms.filter(s => s.thirsty).length,
            kencing: symptoms.filter(s => s.urination).length,
            kabur: symptoms.filter(s => s.blurred_vision).length,
            pusing: symptoms.filter(s => s.dizziness).length,
            mual: symptoms.filter(s => s.nausea).length,
            sakit_kepala: symptoms.filter(s => s.headache).length,
        };

        const symptomY = currentY + 10;
        doc.setFontSize(10);
        doc.text(`- Mudah lelah: ${symptomCount.lelah} hari`, 14, symptomY);
        doc.text(`- Sering haus: ${symptomCount.haus} hari`, 14, symptomY + 7);
        doc.text(`- Sering kencing: ${symptomCount.kencing} hari`, 14, symptomY + 14);
        doc.text(`- Pandangan kabur: ${symptomCount.kabur} hari`, 14, symptomY + 21);
        doc.text(`- Pusing: ${symptomCount.pusing} hari`, 14, symptomY + 28);
        doc.text(`- Mual: ${symptomCount.mual} hari`, 14, symptomY + 35);
        doc.text(`- Sakit kepala: ${symptomCount.sakit_kepala} hari`, 14, symptomY + 42);

        if (Object.values(symptomCount).every(v => v === 0)) {
            doc.text('- Tidak ada gejala yang dicatat', 14, symptomY + 49);
        }

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Health Tracker - Laporan Kesehatan - Halaman ${i} dari ${pageCount}`, 14, doc.internal.pageSize.height - 10);
        }

        doc.save(`laporan-kesehatan-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
            📄 Export ke PDF
        </button>
    );
}