export const hypercert = `
    data {
        creation_block_timestamp
        units
        contract {
          chain_id
        }
        metadata {
          name
          description
        }
        orders {
          totalUnitsForSale
          cheapestOrder {
            pricePerPercentInUSD
          }
        }
        sales {
          data {
            buyer
          }
        }
        hypercert_id
    }
`;
