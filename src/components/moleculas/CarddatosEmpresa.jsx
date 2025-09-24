import styled from "styled-components";

export function CardDatosEmpresa({ titulo, valor, img, descripcion, isQR, link }) {
  return (
    <Container>
      <div className="card">
        <div className="pricing-block-content">
          <p className="pricing-plan">{titulo}</p>
          <div className="price-value">
            {valor && <p className="price-number">{valor}</p>}
            {img && (
              isQR ? (
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <img src={img} alt={titulo} className="img-qr" />
                </a>
              ) : (
                <img src={img} alt={titulo} />
              )
            )}
          </div>
          {descripcion && <p className="descripcion">{descripcion}</p>}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  z-index: 1;
  .card {
    width: 220px;
    background: #fffefe;
    padding: 1rem;
    border-radius: 1rem;
    border: 0.5vmin solid #05060f;
    box-shadow: 0.4rem 0.4rem #05060f;
    overflow: hidden;
    color: black;
    text-align: center;
  }

  .pricing-block-content {
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .pricing-plan {
    color: #05060f;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .price-value {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    img {
      width: 50px; /* default */
    }

    .img-qr {
      width: 160px;   /* más grande */
      height: 160px;
      border-radius: 8px;
      border: 1px solid #05060f;
      transition: transform 0.3s ease;
    }

    .img-qr:hover {
      transform: scale(1.1); /* efecto zoom */
    }
  }

  .descripcion {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #333;
    margin-top: 0.5rem;
  }
`;
