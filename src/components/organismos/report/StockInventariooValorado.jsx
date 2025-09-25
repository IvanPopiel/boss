import styled from "styled-components";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEmpresaStore, useProductosStore } from "../../../index";
import { useQuery } from "@tanstack/react-query";

function StockInventarioValorado() {
  // 1️⃣ Corrección del nombre (sacamos la doble "oo")
  const { reportInventarioValorado } = useProductosStore();
  const { dataempresa } = useEmpresaStore();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["reporte stock valorado", { id_empresa: dataempresa?.id }], // 2️⃣ Corrección clave y param
    queryFn: () => reportInventarioValorado({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa?.id,
  });

  if (isLoading) {
    return <span>Cargando...</span>;
  }
  if (error) {
    return <span>Error: {error.message}</span>;
  }

  // 3️⃣ Calcular el total general (con fallback seguro)
  const totalGeneral = data.reduce((acc, item) => acc + (item.total || 0), 0);

  const styles = StyleSheet.create({
    page: { flexDirection: "row", position: "relative" },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    table: { width: "100%", margin: "auto", marginTop: 10 },
    row: {
      flexDirection: "row",
      borderBottom: 1,
      borderBottomColor: "#121212",
      height: 24,
      borderLeftColor: "#000",
      borderLeft: 1,
      textAlign: "left",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    cell: {
      flex: 1,
      textAlign: "center",
      borderLeftColor: "#000",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    headerCell: {
      flex: 1,
      backgroundColor: "#dcdcdc",
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  const renderTableRow = (rowData, isHeader = false) => (
    <View style={styles.row} key={rowData.id || rowData.descripcion}>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.descripcion}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.preciocompra}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.total}
      </Text>
    </View>
  );

  return (
    <Container>
      <PDFViewer className="pdfviewer">
        <Document title="Reporte de stock valorado">
          <Page size="A4" orientation="portrait">
            <View style={styles.page}>
              <View style={styles.section}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "ultrabold",
                    marginBottom: 10,
                  }}
                >
                  Inventario Valorado
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  Total general: {totalGeneral}
                </Text>
                <Text>Fecha y hora del reporte: {formattedDate}</Text>
                <View style={styles.table}>
                  {renderTableRow(
                    {
                      descripcion: "Producto",
                      stock: "Stock",
                      preciocompra: "Precio",
                      total: "Total",
                    },
                    true
                  )}
                  {data.map((movement) => renderTableRow(movement))}
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80vh;
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default StockInventarioValorado;
