import groupedListings from '../utils/groupListings.mjs';
import { getAllSubsets } from '../utils/getAllSubsets.mjs';
import { validAssignmentExists } from '../utils/checkValidAssignments.mjs'

export const getLocations = (req, res) => {
    // Check for validation errors.
    if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({
          errors: [
            {
                type: "field",
                value: req.body,
                msg: "Request body must be a non-empty array.",
                path: "",
                location: "body"
            }
          ]
        });
    }

    // Flatten the input: each object in the request with quantity > 1
    const vehicles = [];
      for (const { length, quantity } of req.body) {
        for (let i = 0; i < quantity; i++) {
          vehicles.push({ length });
        }
    }
  
    const results = [];
    // Iterate over each location.
    for (const [locationId, locListings] of Object.entries(groupedListings)) {
        if (!locListings || locListings.length === 0) continue;
        
        let bestCost = Infinity;
        let bestSubset = null;
        const subsets = getAllSubsets(locListings);
    
        for (const subset of subsets) {
          const subsetCost = subset.reduce((sum, listing) => sum + listing.price_in_cents, 0);
          if (subsetCost >= bestCost) continue;
          if (validAssignmentExists(subset, vehicles)) {
            bestCost = subsetCost;
            bestSubset = subset;
          }
        }
    
        if (bestSubset) {
          results.push({
            location_id: locationId,
            listing_ids: bestSubset.map(l => l.id),
            total_price_in_cents: bestCost
          });
        }
    }
  
    // Sort by the total price in cents, ascending.
    results.sort((a, b) => a.total_price_in_cents - b.total_price_in_cents);
    res.status(200).json(results);
}