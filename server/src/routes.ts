import { FastifyInstance, RequestGenericInterface } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function appRoutes(app: FastifyInstance) {
    
    app.post("/habits", async (request, reply) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6)),
        });

        const { title, weekDays } = createHabitBody.parse(request.body);

        const today = dayjs.utc().startOf("day").toDate();

        const habits = await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        });

        return reply.code(201).send(habits);

    });

    app.get("/day", async (request, reply) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        });

        const { date } = getDayParams.parse(request.query);
        const weekDay = dayjs.utc(date).day();

        console.log("[log][weekDay]", weekDay);

        // Buscar todos os hábitos possíveis na data
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        });

        return reply.send(possibleHabits);

    });
}


