export const hypercert = `
    data {
        units
        contract {
          chain_id
        }
        metadata {
          image
          name
          description
        }
        orders {
          totalUnitsForSale
          cheapestOrder {
            pricePerPercentInUSD
          }
        }
        hypercertId
    }
`;
