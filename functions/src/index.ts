/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

import * as user from "./user";


// Export functions to deploy

export const inviteUser = user.inviteUser;
export const deleteUser = user.deleteUser;
export const createUserProfile = user.createUserProfile;
