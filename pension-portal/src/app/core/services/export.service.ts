import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ICEA_LION_LOGO_BASE64 } from '../assets/icea-lion-logo';

type ExportValue = string | number;
type ExportRow = Record<string, ExportValue>;

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    exportToExcel(
        data: ExportRow[],
        fileName: string
    ): void {

        const worksheet =
            XLSX.utils.json_to_sheet(data);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Transactions'
        );

        XLSX.writeFile(
            workbook,
            `${fileName}.xlsx`
        );

    }


    exportToPdf(
        data: ExportRow[],
        columns: string[],
        fileName: string,
        title: string
    ): void {

        const doc = new jsPDF({
            orientation: 'landscape'
        });

        const logoSize = 14;

        doc.addImage(
            ICEA_LION_LOGO_BASE64,
            'PNG',
            14,
            8,
            logoSize,
            logoSize
        );

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');

        doc.text(
            'eKYC',
            14 + logoSize + 4,
            16
        );

        doc.setFont('helvetica', 'normal');

        doc.setFontSize(18);

        doc.text(
            title,
            14,
            30
        );


        doc.setFontSize(9);

        doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            14,
            37
        );


        const headers = [
            columns.map(column =>
                this.formatHeader(column)
            )
        ];

        const rows = data.map(row =>

            columns.map(column =>
                this.formatValue(row[column])
            )

        );


        autoTable(doc, {

            head: headers,

            body: rows,

            startY: 43,

            styles: {
                fontSize: 8
            },

            headStyles: {
                fontStyle: 'bold'
            },

            margin: {
                left: 14,
                right: 14
            }

        });


        doc.save(
            `${fileName}.pdf`
        );

    }


    private formatHeader(
        column: string
    ): string {

        return column
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, char =>
                char.toUpperCase()
            );

    }


    private formatValue(
        value: ExportValue
    ): string {

        if (
            value === null ||
            value === undefined
        ) {

            return '';

        }

        if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
            return new Date(value).toLocaleDateString();
        }

        return String(value);

    }

}