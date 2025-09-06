"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient as getClerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";

export async function getCurrentUser(
  email: string
): Promise<CurrentUserResponse> {
  if (!email) return { role: null, user: null };

  try {
    // donor
    const donor = await db.donorRegistration.findUnique({
      where: { email },
    });

    if (donor) {
      return {
        role: "DONOR",
        user: {
          ...donor,
          dateOfBirth: donor.dateOfBirth ? donor.dateOfBirth.toISOString() : "",
          lastDonation: donor.lastDonation
            ? donor.lastDonation.toISOString()
            : null,
        } as DonorData,
      };
    }

    // hospital
    const hospital = await db.hospitalRegistration.findFirst({
      where: { contactEmail: email },
    });

    if (hospital) {
      return {
        role: "HOSPITAL",
        user: {
          ...hospital,
          licenseExpiryDate: hospital.licenseExpiryDate
            ? hospital.licenseExpiryDate.toISOString()
            : "",
          nocExpiryDate: hospital.nocExpiryDate
            ? hospital.nocExpiryDate.toISOString()
            : "",
        } as HospitalData,
      };
    }

    return { role: null, user: null };
  } catch (err) {
    console.error("[getCurrentUser] error:", err);
    throw err;
  }
}