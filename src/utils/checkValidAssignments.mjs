
import { fitsInListing } from './listings.mjs';

// For a given subset of listings (an array) and an array of vehicles, enumerate every assignment (each vehicle is assigned to one listing in the subset).
// Represent an assignment as an array of indices (one per vehicle) where the index refers to the listing in the subset.
export const validAssignmentExists = (listingsSubset, vehicles) => {
    const k = listingsSubset.length;
    const m = vehicles.length;
    const totalAssignments = Math.pow(k, m);
  
    // Loop over every possible assignment from 0 to k^m - 1.
    for (let assign = 0; assign < totalAssignments; assign++) {
        const assignment = [];
        let temp = assign;
        // Decode the assignment in base k.
        for (let i = 0; i < m; i++) {
            assignment.push(temp % k);
            temp = Math.floor(temp / k);
        }
        // Group vehicles by the listing (index) they are assigned to.
        const groups = Array.from({ length: k }, () => []);
        for (let i = 0; i < m; i++) {
            groups[assignment[i]].push(vehicles[i]);
        }
        // Check each group: if vehicles are assigned, they must all fit in that listing.
        let allFit = true;
        for (let j = 0; j < k; j++) {
            if (!fitsInListing(listingsSubset[j], groups[j])) {
                allFit = false;
                break;
            }
        }
        if (allFit) {
            return true;
        }
    }
    return false;
};