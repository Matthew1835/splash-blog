import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import prisma from "../lib/prisma.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

export default (passport) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: payload.sub },
                    select: { id: true, username: true, email: true, role: true },
                });

                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};