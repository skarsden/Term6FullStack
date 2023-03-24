package com.info5059.casestudy.purchaseorder;

import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import org.springframework.web.servlet.view.document.AbstractPdfView;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * ReportPDFGenerator - a class for creating dynamic expense report output in
 * PDF format using the iText 7 library
 *
 * @author Evan
 */
public abstract class POPDFGenerator extends AbstractPdfView {
        public static ByteArrayInputStream generateReport(String poid, PurchaseOrderDAO poDAO,
                        VendorRepository vendorRepository, ProductRepository expenseRepository) throws IOException {
                URL imageUrl = POPDFGenerator.class.getResource("/static/images/logo.jpg");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);
                // Initialize PDF document to be written to a stream not a file
                PdfDocument pdf = new PdfDocument(writer);
                // Document is the main object
                Document document = new Document(pdf);
                PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
                // add the image to the document
                Image img = new Image(ImageDataFactory.create(imageUrl)).scaleAbsolute(120, 40).setFixedPosition(80,
                                710);
                document.add(img);
                // now let's add a big heading
                document.add(new Paragraph("\n\n"));
                Locale locale = new Locale("en", "US");
                NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
                try {
                        PurchaseOrder po = poDAO.findOne(Long.parseLong(poid));
                        document.add(new Paragraph(String.format("Purchase Order")).setFont(font).setFontSize(24)
                                        .setMarginRight(75).setTextAlignment(TextAlignment.RIGHT).setBold());
                        document.add(new Paragraph("#:" + poid).setFont(font).setFontSize(16).setBold()
                                        .setMarginRight(150).setMarginTop(-10).setTextAlignment(TextAlignment.RIGHT));
                        document.add(new Paragraph("\n\n"));

                        Optional<Vendor> opt = vendorRepository.findById(po.getVendorid());

                        if (opt.isPresent()) {
                                // Vendor info table
                                Vendor vendor = opt.get();

                                Table table = new Table(2);
                                table.setWidth(new UnitValue(UnitValue.PERCENT, 10));

                                Cell cell = new Cell()
                                                .add(new Paragraph("Vendor: ").setBorder(Border.NO_BORDER).setFont(font)
                                                                .setFontSize(12).setBold())
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
                                table.addCell(cell);
                                cell = new Cell()
                                                .add(new Paragraph(vendor.getVendorname()).setBorder(Border.NO_BORDER)
                                                                .setFont(font).setFontSize(12))
                                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
                                table.addCell(cell);

                                cell = new Cell()
                                                .add(new Paragraph().setBorder(Border.NO_BORDER).setFont(font)
                                                                .setFontSize(12).setBold())
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
                                table.addCell(cell);
                                cell = new Cell()
                                                .add(new Paragraph(vendor.getAddress1()).setBorder(Border.NO_BORDER)
                                                                .setFont(font).setFontSize(12))
                                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
                                table.addCell(cell);

                                cell = new Cell()
                                                .add(new Paragraph().setBorder(Border.NO_BORDER).setFont(font)
                                                                .setFontSize(12).setBold())
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
                                table.addCell(cell);
                                cell = new Cell()
                                                .add(new Paragraph(vendor.getCity()).setBorder(Border.NO_BORDER)
                                                                .setFont(font).setFontSize(12))
                                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
                                table.addCell(cell);

                                cell = new Cell()
                                                .add(new Paragraph().setBorder(Border.NO_BORDER).setFont(font)
                                                                .setFontSize(12).setBold())
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
                                table.addCell(cell);
                                cell = new Cell()
                                                .add(new Paragraph(vendor.getProvince()).setBorder(Border.NO_BORDER)
                                                                .setFont(font).setFontSize(12))
                                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
                                table.addCell(cell);

                                cell = new Cell()
                                                .add(new Paragraph().setBorder(Border.NO_BORDER).setFont(font)
                                                                .setFontSize(12).setBold())
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER);
                                table.addCell(cell);
                                cell = new Cell()
                                                .add(new Paragraph(vendor.getEmail()).setBorder(Border.NO_BORDER)
                                                                .setFont(font).setFontSize(12))
                                                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
                                table.addCell(cell);

                                document.add(table);

                                document.add(new Paragraph());

                                // Table headers
                                Table expenseTable = new Table(5);
                                expenseTable.setWidth(new UnitValue(UnitValue.PERCENT, 100));

                                cell = new Cell().add(
                                                new Paragraph("Product Code").setFont(font).setFontSize(12).setBold())
                                                .setTextAlignment(TextAlignment.CENTER);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph("Name").setFont(font).setFontSize(12).setBold())
                                                .setTextAlignment(TextAlignment.CENTER);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph("Qty Sold").setFont(font).setFontSize(12).setBold())
                                                .setTextAlignment(TextAlignment.CENTER);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph("Price").setFont(font).setFontSize(12).setBold())
                                                .setTextAlignment(TextAlignment.CENTER);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(
                                                new Paragraph("Ext. Price").setFont(font).setFontSize(12).setBold())
                                                .setTextAlignment(TextAlignment.CENTER);
                                expenseTable.addCell(cell);

                                BigDecimal extPrice = new BigDecimal(0.0);
                                BigDecimal subTot = new BigDecimal(0.0);

                                // Expense items
                                for (PurchaseOrderLineItem line : po.getItems()) {
                                        Optional<Product> optx = expenseRepository.findById(line.getProductid());
                                        if (optx.isPresent()) {
                                                Product product = optx.get();
                                                cell = new Cell()
                                                                .add(new Paragraph(product.getId()).setFont(font)
                                                                                .setFontSize(12))
                                                                .setTextAlignment(TextAlignment.CENTER);
                                                expenseTable.addCell(cell);
                                                cell = new Cell()
                                                                .add(new Paragraph(product.getName()).setFont(font)
                                                                                .setFontSize(12))
                                                                .setTextAlignment(TextAlignment.CENTER);
                                                expenseTable.addCell(cell);
                                                cell = new Cell()
                                                                .add(new Paragraph("" + line.getQty()).setFont(font)
                                                                                .setFontSize(12))
                                                                .setTextAlignment(TextAlignment.RIGHT);
                                                expenseTable.addCell(cell);
                                                cell = new Cell().add(
                                                                new Paragraph(formatter.format(product.getCostprice()))
                                                                                .setFont(font).setFontSize(12))
                                                                .setTextAlignment(TextAlignment.RIGHT);
                                                expenseTable.addCell(cell);

                                                extPrice = product.getCostprice().multiply(
                                                                BigDecimal.valueOf(line.getQty()),
                                                                new MathContext(8, RoundingMode.UP));

                                                cell = new Cell()
                                                                .add(new Paragraph(formatter.format(extPrice))
                                                                                .setFont(font).setFontSize(12))
                                                                .setTextAlignment(TextAlignment.RIGHT);
                                                expenseTable.addCell(cell);

                                                subTot = subTot.add(extPrice, new MathContext(8, RoundingMode.UP));
                                        }
                                }

                                BigDecimal tax = new BigDecimal(0.0);
                                BigDecimal total = new BigDecimal(0.0);

                                tax = subTot.multiply(BigDecimal.valueOf(0.13), new MathContext(8, RoundingMode.UP));
                                total = tax.add(subTot, new MathContext(8, RoundingMode.UP));

                                // Totals
                                cell = new Cell(1, 4).add(new Paragraph("Sub Total:")).setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(subTot)))
                                                .setTextAlignment(TextAlignment.RIGHT);
                                expenseTable.addCell(cell);

                                cell = new Cell(1, 4).add(new Paragraph("Tax:")).setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(tax)))
                                                .setTextAlignment(TextAlignment.RIGHT);
                                expenseTable.addCell(cell);

                                cell = new Cell(1, 4).add(new Paragraph("PO Total:")).setBorder(Border.NO_BORDER)
                                                .setTextAlignment(TextAlignment.RIGHT);
                                expenseTable.addCell(cell);
                                cell = new Cell().add(new Paragraph(formatter.format(total)))
                                                .setTextAlignment(TextAlignment.RIGHT)
                                                .setBackgroundColor(ColorConstants.YELLOW);
                                expenseTable.addCell(cell);

                                document.add(expenseTable);

                                document.add(new Paragraph(po.getPodate().getYear() + "-"
                                                + po.getPodate().getMonthValue() + "-" + po.getPodate().getDayOfMonth()
                                                + " " + po.getPodate().getHour() + ":" + po.getPodate().getMinute()
                                                + ":" + po.getPodate().getSecond()).setFont(font).setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER).setBold());

                                document.close();
                        }

                } catch (Exception ex) {
                        Logger.getLogger(POPDFGenerator.class.getName()).log(Level.SEVERE, null, ex);
                }
                // finally send stream back to the controller
                return new ByteArrayInputStream(baos.toByteArray());
        }
}