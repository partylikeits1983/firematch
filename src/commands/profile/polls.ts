import { Context } from 'telegraf';

export class Polls {
    private pollsMap: Map<string, { type: string; userId: number }> = new Map();

    async sendGenderPoll(ctx: Context, userId: number) {
        const poll = await ctx.telegram.sendPoll(userId, 'Your Gender', ['Male', 'Female'], {
            is_anonymous: false,
        });

        if (poll) {
            this.pollsMap.set(poll.poll.id, {
                type: 'Your Gender',
                userId: userId,
            });
        }

        return poll;
    }

    async sendPreferencePoll(ctx: Context, userId: number) {
        const poll = await ctx.telegram.sendPoll(
            userId,
            'Your preference (who you want to meet)',
            ['Guys', 'Girls'],
            {
                is_anonymous: false,
            },
        );

        if (poll) {
            this.pollsMap.set(poll.poll.id, {
                type: 'Your preference (who you want to meet)',
                userId: userId,
            });
        }

        return poll;
    }

    async sendShareLocationPoll(ctx: Context, userId: number) {
        const poll = await ctx.telegram.sendPoll(
            userId,
            'Share location for more precise matches?',
            ['Yes', 'No', 'Skip'],
            { is_anonymous: false },
        );

        if (poll) {
            this.pollsMap.set(poll.poll.id, {
                type: 'Share location for more precise matches?',
                userId: userId,
            });
        }
        return poll;
    }

    async sendAgeMessage(ctx: Context, userId: number) {
        return await ctx.telegram.sendMessage(userId, 'What is your age?');
    }

    async sendBioMessage(ctx: Context, userId: number) {
        return await ctx.telegram.sendMessage(userId, 'Write a short bio about yourself');
    }

    getPollInfo(pollId: string): { type: string; userId: number } | undefined {
        return this.pollsMap.get(pollId);
    }
}
