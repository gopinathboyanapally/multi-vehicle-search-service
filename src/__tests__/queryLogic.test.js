import { fitsInListing } from '../utils/listings.mjs';
import { getAllSubsets } from '../utils/getAllSubsets.mjs';
import { validAssignmentExists } from '../utils/checkValidAssignments.mjs';
  
describe('fitsInListing', () => {
    it('should return true if no vehicles are provided', () => {
        const listing = { length: 20, width: 20 };
        expect(fitsInListing(listing, [])).toBe(true);
    });

    it('should return true when a single vehicle fits in the listing', () => {
        const listing = { length: 20, width: 20 };
        const vehicles = [{ length: 10 }];
        // maxVehicleLength = 10, totalWidth = 10
        expect(fitsInListing(listing, vehicles)).toBe(true);
    });

    it('should return false when a vehicle exceeds the listing length', () => {
        const listing = { length: 15, width: 20 };
        const vehicles = [{ length: 20 }];
        // maxVehicleLength = 20 > 15
        expect(fitsInListing(listing, vehicles)).toBe(false);
    });

    it('should return false when total required width exceeds listing width', () => {
        const listing = { length: 30, width: 20 };
        const vehicles = [{ length: 10 }, { length: 10 }, { length: 10 }];
        // totalWidth = 3 * 10 = 30 > 20
        expect(fitsInListing(listing, vehicles)).toBe(false);
    });
});
  
describe('getAllSubsets', () => {
    it('should return an empty array for an empty input array', () => {
        expect(getAllSubsets([])).toEqual([]);
    });

    it('should return all subsets for a one-element array', () => {
        expect(getAllSubsets([1])).toEqual([[1]]);
    });

    it('should return the correct subsets for a two-element array', () => {
        const arr = [1, 2];
        const subsets = getAllSubsets(arr);
        // Expected non-empty subsets: [ [1], [2], [1,2] ]
        expect(subsets.length).toBe(3);
        expect(subsets).toEqual(expect.arrayContaining([[1], [2], [1,2]]));
    });

    it('should return 7 subsets for a three-element array', () => {
        const arr = [1, 2, 3];
        const subsets = getAllSubsets(arr);
        expect(subsets.length).toBe(7);
        expect(subsets).toEqual(expect.arrayContaining([
            [1],
            [2],
            [3],
            [1,2],
            [1,3],
            [2,3],
            [1,2,3]
        ]));
    });
});
  
describe('validAssignmentExists', () => {
    const listingA = { id: 'A', length: 20, width: 20, price_in_cents: 100 };
    const listingB = { id: 'B', length: 30, width: 30, price_in_cents: 150 };
  
    it('should return true when a single listing can accommodate all vehicles', () => {
        // For listingA: maxVehicleLength = 20, totalWidth = 2*10 = 20, which exactly fits.
        const vehicles = [{ length: 10 }, { length: 20 }];
        expect(validAssignmentExists([listingA], vehicles)).toBe(true);
    });
  
    it('should return false when a single listing cannot accommodate vehicles', () => {
        // Vehicle length 25 does not fit in listingA (length: 20)
        const vehicles = [{ length: 10 }, { length: 25 }];
        expect(validAssignmentExists([listingA], vehicles)).toBe(false);
    });
  
    it('should return true when multiple listings allow a valid assignment', () => {
        // With listings A and B, assign vehicle with length 25 to listingB and the other to listingA.
        const vehicles = [{ length: 10 }, { length: 25 }];
        expect(validAssignmentExists([listingA, listingB], vehicles)).toBe(true);
    });
  
    it('should return false if no valid assignment exists with the given listings', () => {
        // With only listingA, two vehicles with length 25 each will not fit.
        const vehicles = [{ length: 25 }, { length: 25 }];
        expect(validAssignmentExists([listingA], vehicles)).toBe(false);
    });
});
  
describe('Overall logic for location search', () => {
    const groupedListings = {
        "1": [
            { id: "1", length: 25, width: 20, price_in_cents: 100 },
            { id: "2", length: 25, width: 20, price_in_cents: 100 },
            { id: "3", length: 25, width: 20, price_in_cents: 100 }
        ],
        "2": [
            { id: "4", length: 25, width: 20, price_in_cents: 100 },
            { id: "5", length: 25, width: 20, price_in_cents: 205 }
        ]
    };
  
    // Helper function that mimics the overall location search logic.
    const getLocationsForTest = (vehiclesInput, groupedListingsInput) => {
      // Flatten the vehicles input.
        const vehicles = [];
        for (const { length, quantity } of vehiclesInput) {
            for (let i = 0; i < quantity; i++) {
                vehicles.push({ length });
            }
        }
    
        const results = [];
        for (const [locationId, locListings] of Object.entries(groupedListingsInput)) {
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
    
        results.sort((a, b) => a.total_price_in_cents - b.total_price_in_cents);
        return results;
    };
  
    it('should return the expected output for valid vehicles input', () => {
        const vehiclesInput = [
            { length: 10, quantity: 1 },
            { length: 20, quantity: 2 },
            { length: 25, quantity: 1 }
        ];
        const expectedOutput = [
            {
                location_id: "1",
                listing_ids: ["1", "2"],
                total_price_in_cents: 200
            },
            {
                location_id: "2",
                listing_ids: ["4", "5"],
                total_price_in_cents: 305
            }
        ];
        const results = getLocationsForTest(vehiclesInput, groupedListings);
        expect(results).toEqual(expectedOutput);
    });
});