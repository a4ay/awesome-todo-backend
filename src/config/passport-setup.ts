import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from "../models/user-model";


export default function passportSetup(passport : any){

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login

passport.serializeUser((user:any, done:any) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id:any, done:any) => {
  User.findById(id)
    .then((user:any )=> {
      done(null, user as any);
    })
    .catch((e:any) => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:5000/auth/google/redirect"
  },
  function(accessToken : any, refreshToken : any, profile: any, done : any) {

    User.findOne({googleId : profile.id},
      function(err : any, user:any){

        if(!user){
          const newUser = new User({
            name: profile.displayName,
            googleId: profile.id,
            profileImageUrl: profile.photos[0]['value'],
            emailId: profile.emails[0]['value']
          })
          return newUser.save().then( (u:any) => {
            done(null,u);
          })

        }

        return done(null,user);

      })
  }
));
}