yarn global add @vue/cli
yarn global add @aws-amplify/cli

yarn create quasar


yarn add @aws-amplify/ui-vue aws-amplify

amplify configure (skip if you already have the AWS AMplify user you will use)

amplify init
amplify add auth
amplify push

cloudappdevwebpackauth
cloudapp_devwebpack_identity_pool
cloudapp_devwebpack_user_pool

cloudappdevviteauth
cloudapp_devvite_identity_pool
cloudapp_devvite_user_pool

Your TachyonCMS authentication code is {####}
Your TachyonCMS verification code
Your TachyonCMS verification code is {####}

Do you want to use the default authentication and security configuration? Manual configuration
Select the authentication/authorization services that you want to use: User Sign-Up, Sign-In, connected with AWS IAM controls (Enables per-user Storage features for images or other content, Analytics, and more)
Provide a friendly name for your resource that will be used to label this category in the project: cloudappdevauth
Enter a name for your identity pool. cloudapp_dev_identity_pool
Allow unauthenticated logins? (Provides scoped down permissions that you can control via AWS IAM) No
Do you want to enable 3rd party authentication providers in your identity pool? No
Provide a name for your user pool: cloudapp_dev_user_pool
Warning: you will not be able to edit these selections.
How do you want users to be able to sign in? Username
Do you want to add User Pool Groups? Yes
? Provide a name for your user pool group: admin
? Do you want to add another User Pool Group Yes
? Provide a name for your user pool group: tech
? Do you want to add another User Pool Group No
✔ Sort the user pool groups in order of preference · admin, tech
Do you want to add an admin queries API? No
Multifactor authentication (MFA) user login options: OPTIONAL (Individual users can use MFA)
For user login, select the MFA types: SMS Text Message, Time-Based One-Time Password (TOTP)
Specify an SMS authentication message: Your TachyonCMS authentication code is {####}
Email based user registration/forgot password: Enabled (Requires per-user email entry at registration)
Specify an email verification subject: Your TachyonCMS verification code
Specify an email verification message: Your TachyonCMS verification code is {####}
Do you want to override the default password policy for this User Pool? Yes
Enter the minimum password length for this User Pool: 12
Select the password character requirements for your userpool:
Warning: you will not be able to edit these selections.
What attributes are required for signing up? Email
Specify the app's refresh token expiration period (in days): 30
Do you want to specify the user attributes this app can read and write? Yes
Specify read attributes: Address, Birthdate, Email, Family Name, Middle Name, Gender, Locale, Given Name, Name, Nickname, Phone Number, Picture, Profile, Updated At, Website, Zone Info, Email Verified?, Phone Number Verified?
Specify write attributes: Address, Birthdate, Family Name, Middle
Name, Gender, Locale, Given Name, Name, Nickname, Phone Number, Picture, Profile, Website, Zone Info
Do you want to enable any of the following capabilities?
Do you want to use an OAuth flow? No
? Do you want to configure Lambda Triggers for Cognito? No

amplify push

Create Amplify boot file

```js
import { boot } from "quasar/wrappers";

import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

import AmplifyVue from "@aws-amplify/ui-vue";

export default boot(({ app }) => {
  app.use(AmplifyVue);
});

```