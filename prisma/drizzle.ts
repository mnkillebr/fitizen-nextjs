import { customType, pgEnum, pgTable, text, timestamp, integer, boolean, decimal, doublePrecision, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const customBytes = customType<{ data: Buffer }>({
	dataType() {
		return 'bytea';
	},
	fromDriver(value: unknown) {
		if (Buffer.isBuffer(value)) return value
		throw new Error('Expected Buffer')
	},
	toDriver(value: Buffer) {
		return value
	}
});

export const appointmentTypeEnum = pgEnum('AppointmentType', ['GOAL_SETTING', 'FOLLOWUP']);

export const roleEnum = pgEnum('Role', ['admin', 'user']);

export const balanceTypeEnum = pgEnum('BalanceType', ['bilateral', 'unilateral']);

export const balanceLevelEnum = pgEnum('BalanceLevel', ['static', 'dynamic']);

export const bodyFocusEnum = pgEnum('BodyFocus', ['upper', 'lower', 'core', 'full']);

export const contractionTypeEnum = pgEnum('ContractionType', ['isometric', 'isotonic']);

export const equipmentEnum = pgEnum('Equipment', ['bodyweight', 'dumbbell', 'kettlebell', 'barbell', 'resistance_band', 'suspension', 'parallette', 'slider_discs', 'gymnastics_rings', 'foam_roller', 'medicine_ball', 'sled', 'bike', 'plyo_box', 'bench', 'cable_machine']);

export const jointEnum = pgEnum('Joint', ['ankle', 'knee', 'hip', 'shoulder', 'elbow', 'wrist']);

export const liftTypeEnum = pgEnum('LiftType', ['compound', 'isolation']);

export const heightUnitEnum = pgEnum('HeightUnit', ['inches', 'centimeters']);

export const loadUnitEnum = pgEnum('LoadUnit', ['bodyweight', 'kilogram', 'pound']);

export const muscleGroupEnum = pgEnum('MuscleGroup', ['quads', 'hamstrings', 'glutes', 'calves', 'shoulders', 'biceps', 'triceps', 'forearms', 'pecs', 'lats', 'traps', 'hip_flexors', 'erectors', 'adductors', 'abductors', 'abs', 'obliques', 'serratus', 'pelvic_floor']);

export const movementPatternEnum = pgEnum('MovementPattern', ['push', 'pull', 'core', 'squat', 'hinge', 'lunge', 'rotational', 'locomotive']);

export const movementPlaneEnum = pgEnum('MovementPlane', ['frontal', 'sagittal', 'transverse']);

export const stretchTypeEnum = pgEnum('StretchType', ['static', 'dynamic']);

export const sectionTypeEnum = pgEnum('SectionType', ['warmup', 'main', 'cooldown']);

export const groupTypeEnum = pgEnum('GroupType', ['circuit', 'regular']);

export const exerciseTargetEnum = pgEnum('ExerciseTarget', ['reps', 'time']);

export const sideEnum = pgEnum('Side', ['left', 'right', 'none']);

export const recurrenceEnum = pgEnum('Recurrence', ['DAILY', 'WEEKLY', 'MONTHLY']);

export const users = pgTable('User', { id: text('id').primaryKey(), email: text('email').notNull(), passwordHash: text('passwordHash'), profilePhotoUrl: text('profilePhotoUrl'), profilePhotoId: text('profilePhotoId'), firstName: text('firstName').notNull(), lastName: text('lastName').notNull(), createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(), updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull(), role: roleEnum('role').notNull() });

export const fitnessProfiles = pgTable('FitnessProfile', { id: text('id').primaryKey(), userId: text('userId').notNull(), heightUnit: heightUnitEnum('heightUnit').default('inches').notNull(), height: integer('height'), unit: loadUnitEnum('unit').default('pound').notNull(), currentWeight: integer('currentWeight'), targetWeight: integer('targetWeight'), goal_fatLoss: boolean('goal_fatLoss'), goal_endurance: boolean('goal_endurance'), goal_buildMuscle: boolean('goal_buildMuscle'), goal_loseWeight: boolean('goal_loseWeight'), goal_improveBalance: boolean('goal_improveBalance'), goal_improveFlexibility: boolean('goal_improveFlexibility'), goal_learnNewSkills: boolean('goal_learnNewSkills'), parq_heartCondition: boolean('parq_heartCondition'), parq_chestPainActivity: boolean('parq_chestPainActivity'), parq_chestPainNoActivity: boolean('parq_chestPainNoActivity'), parq_balanceConsciousness: boolean('parq_balanceConsciousness'), parq_boneJoint: boolean('parq_boneJoint'), parq_bloodPressureMeds: boolean('parq_bloodPressureMeds'), parq_otherReasons: boolean('parq_otherReasons'), operational_occupation: text('operational_occupation'), operational_extendedSitting: boolean('operational_extendedSitting'), operational_repetitiveMovements: boolean('operational_repetitiveMovements'), operational_explanation_repetitiveMovements: text('operational_explanation_repetitiveMovements'), operational_heelShoes: boolean('operational_heelShoes'), operational_mentalStress: boolean('operational_mentalStress'), recreational_physicalActivities: boolean('recreational_physicalActivities'), recreational_explanation_physicalActivities: text('recreational_explanation_physicalActivities'), recreational_hobbies: boolean('recreational_hobbies'), recreational_explanation_hobbies: text('recreational_explanation_hobbies'), medical_injuriesPain: boolean('medical_injuriesPain'), medical_explanation_injuriesPain: text('medical_explanation_injuriesPain'), medical_surgeries: boolean('medical_surgeries'), medical_explanation_surgeries: text('medical_explanation_surgeries'), medical_chronicDisease: boolean('medical_chronicDisease'), medical_explanation_chronicDisease: text('medical_explanation_chronicDisease'), medical_medications: boolean('medical_medications'), medical_explanation_medications: text('medical_explanation_medications') });

export const socialLogins = pgTable('SocialLogin', { id: text('id').primaryKey(), provider: text('provider').notNull(), providerUserId: text('providerUserId').notNull(), userId: text('userId').notNull() });

export const subscriptions = pgTable('Subscription', { id: text('id').primaryKey(), name: text('name').notNull(), price: decimal('price', { precision: 65, scale: 30 }).notNull(), description: text('description') });

export const userSubscriptions = pgTable('UserSubscription', { id: text('id').primaryKey(), userId: text('userId').notNull(), subscriptionId: text('subscriptionId').notNull(), startDate: timestamp('startDate', { mode: 'date', precision: 3 }).notNull(), endDate: timestamp('endDate', { mode: 'date', precision: 3 }) });

export const programs = pgTable('Program', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description'), isFree: boolean('isFree').default(false).notNull(), price: decimal('price', { precision: 65, scale: 30 }), youtubeLink: text('youtubeLink'), s3ImageKey: text('s3ImageKey'), s3VideoKey: text('s3VideoKey'), muxPlaybackId: text('muxPlaybackId'), userId: text('userId') });

export const routines = pgTable('Routine', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description'), isFree: boolean('isFree').default(false).notNull(), youtubeLink: text('youtubeLink'), s3ImageKey: text('s3ImageKey'), s3VideoKey: text('s3VideoKey'), createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(), userId: text('userId') });

export const programWeeks = pgTable('ProgramWeek', { id: text('id').primaryKey(), programId: text('programId').notNull(), weekNumber: integer('weekNumber').notNull() });

export const programDays = pgTable('ProgramDay', { id: text('id').primaryKey(), programWeekId: text('programWeekId').notNull(), dayNumber: integer('dayNumber').notNull(), movementPrepId: text('movementPrepId').notNull(), warmupId: text('warmupId').notNull(), cooldownId: text('cooldownId').notNull() });

export const programBlocks = pgTable('ProgramBlock', { id: text('id').primaryKey(), programDayId: text('programDayId').notNull(), blockNumber: integer('blockNumber').notNull() });

export const programRoutines = pgTable('ProgramRoutine', { programId: text('programId').notNull(), routineId: text('routineId').notNull() });

export const movementPreps = pgTable('MovementPrep', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description') });

export const foamRollingExercises = pgTable('FoamRollingExercise', { movementPrepId: text('movementPrepId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull(), time: integer('time') });

export const mobilityExercises = pgTable('MobilityExercise', { movementPrepId: text('movementPrepId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull(), time: integer('time') });

export const activationExercises = pgTable('ActivationExercise', { movementPrepId: text('movementPrepId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull(), time: integer('time') });

export const warmups = pgTable('Warmup', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description') });

export const dynamicExercises = pgTable('DynamicExercise', { warmupId: text('warmupId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull() });

export const ladderExercises = pgTable('LadderExercise', { warmupId: text('warmupId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull() });

export const powerExercises = pgTable('PowerExercise', { warmupId: text('warmupId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps').notNull() });

export const cooldowns = pgTable('Cooldown', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description') });

export const cooldownExercises = pgTable('CooldownExercise', { cooldownId: text('cooldownId').notNull(), exerciseId: text('exerciseId').notNull(), reps: integer('reps'), time: integer('time') });

export const exercises = pgTable('Exercise', { id: text('id').primaryKey(), name: text('name').notNull(), description: text('description'), isFree: boolean('isFree').default(false).notNull(), cues: text('cues').array().notNull(), tips: text('tips').array().notNull(), youtubeLink: text('youtubeLink'), s3ImageKey: text('s3ImageKey'), s3VideoKey: text('s3VideoKey'), muxPlaybackId: text('muxPlaybackId'), tags: text('tags').array().notNull(), balance: balanceTypeEnum('balance'), balanceLevel: balanceLevelEnum('balanceLevel'), body: bodyFocusEnum('body').array().notNull(), contraction: contractionTypeEnum('contraction'), equipment: equipmentEnum('equipment').array().notNull(), joint: jointEnum('joint').array().notNull(), lift: liftTypeEnum('lift'), muscles: muscleGroupEnum('muscles').array().notNull(), pattern: movementPatternEnum('pattern').array().notNull(), plane: movementPlaneEnum('plane').array().notNull(), stretch: stretchTypeEnum('stretch'), createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }).defaultNow().notNull(), updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }).notNull() });

export const routineExercises = pgTable('RoutineExercise', { routineId: text('routineId').notNull(), exerciseId: text('exerciseId').notNull(), orderInRoutine: integer('orderInRoutine').notNull(), circuitId: text('circuitId'), sets: text('sets'), target: exerciseTargetEnum('target').notNull(), reps: text('reps'), time: text('time'), notes: text('notes'), rest: text('rest').notNull(), rpe: integer('rpe').default(1).notNull(), side: sideEnum('side') });

export const blockExercises = pgTable('BlockExercise', { programBlockId: text('programBlockId').notNull(), exerciseId: text('exerciseId').notNull(), orderInBlock: integer('orderInBlock').notNull(), sets: integer('sets'), target: exerciseTargetEnum('target').notNull(), reps: integer('reps'), time: integer('time'), notes: text('notes'), rest: integer('rest'), side: sideEnum('side') });

export const programLogs = pgTable('ProgramLog', { id: text('id').primaryKey(), userId: text('userId').notNull(), programId: text('programId').notNull(), programWeek: integer('programWeek').default(1).notNull(), programDay: integer('programDay').default(1).notNull(), date: timestamp('date', { mode: 'date', precision: 3 }).defaultNow().notNull(), duration: text('duration').notNull() });

export const programExerciseLogs = pgTable('ProgramExerciseLog', { id: text('id').primaryKey(), programLogId: text('programLogId').notNull(), programBlockId: text('programBlockId').notNull(), exerciseId: text('exerciseId').notNull() });

export const programExerciseLogSets = pgTable('ProgramExerciseLogSet', { id: text('id').primaryKey(), programExerciseLogId: text('programExerciseLogId').notNull(), set: text('set').notNull(), actualReps: text('actualReps'), load: doublePrecision('load'), notes: text('notes'), unit: loadUnitEnum('unit').default('pound').notNull() });

export const workoutLogs = pgTable('WorkoutLog', { id: text('id').primaryKey(), userId: text('userId').notNull(), routineId: text('routineId').notNull(), date: timestamp('date', { mode: 'date', precision: 3 }).defaultNow().notNull(), duration: text('duration').notNull() });

export const exerciseLogs = pgTable('ExerciseLog', { id: text('id').primaryKey(), workoutLogId: text('workoutLogId').notNull(), exerciseId: text('exerciseId').notNull(), circuitId: text('circuitId'), orderInRoutine: integer('orderInRoutine').notNull(), target: exerciseTargetEnum('target').notNull(), time: text('time'), targetReps: text('targetReps') });

export const exerciseLogSets = pgTable('ExerciseLogSet', { id: text('id').primaryKey(), exerciseLogId: text('exerciseLogId').notNull(), set: text('set').notNull(), actualReps: text('actualReps'), load: doublePrecision('load'), notes: text('notes'), unit: loadUnitEnum('unit').default('pound').notNull() });

export const workoutSessions = pgTable('WorkoutSession', { id: text('id').primaryKey(), userId: text('userId').notNull(), routineId: text('routineId').notNull(), startTime: timestamp('startTime', { mode: 'date', precision: 3 }).notNull(), endTime: timestamp('endTime', { mode: 'date', precision: 3 }).notNull(), recurrence: recurrenceEnum('recurrence') });

export const coaches = pgTable('Coach', { id: text('id').primaryKey(), name: text('name').notNull() });

export const availabilities = pgTable('Availability', { id: text('id').primaryKey(), coachId: text('coachId').notNull(), dayOfWeek: integer('dayOfWeek').notNull(), startTime: timestamp('startTime', { mode: 'date', precision: 3 }).notNull(), endTime: timestamp('endTime', { mode: 'date', precision: 3 }).notNull() });

export const appointments = pgTable('Appointment', { id: text('id').primaryKey(), userId: text('userId').notNull(), coachId: text('coachId').notNull(), startTime: timestamp('startTime', { mode: 'date', precision: 3 }).notNull(), endTime: timestamp('endTime', { mode: 'date', precision: 3 }).notNull(), type: appointmentTypeEnum('type').notNull() });

export const leaderboards = pgTable('Leaderboard', { id: serial('id').primaryKey(), userId: text('userId').notNull(), routineId: text('routineId').notNull(), score: integer('score').notNull(), date: timestamp('date', { mode: 'date', precision: 3 }).defaultNow().notNull() });

export const usersRelations = relations(users, (helpers) => ({ socialLogins: helpers.many(socialLogins, { relationName: 'SocialLoginToUser' }), userSubscriptions: helpers.many(userSubscriptions, { relationName: 'UserToUserSubscription' }), workoutLogs: helpers.many(workoutLogs, { relationName: 'UserToWorkoutLog' }), programLogs: helpers.many(programLogs, { relationName: 'ProgramLogToUser' }), userRoutines: helpers.many(routines, { relationName: 'RoutineToUser' }), userPrograms: helpers.many(programs, { relationName: 'ProgramToUser' }), leaderboardScores: helpers.many(leaderboards, { relationName: 'LeaderboardToUser' }), scheduledWorkouts: helpers.many(workoutSessions, { relationName: 'UserToWorkoutSession' }), scheduledAppointments: helpers.many(appointments, { relationName: 'AppointmentToUser' }), fitnessProfile: helpers.one(fitnessProfiles) }));

export const fitnessProfilesRelations = relations(fitnessProfiles, (helpers) => ({ user: helpers.one(users, { relationName: 'FitnessProfileToUser', fields: [ fitnessProfiles.userId ], references: [ users.id ] }) }));

export const socialLoginsRelations = relations(socialLogins, (helpers) => ({ user: helpers.one(users, { relationName: 'SocialLoginToUser', fields: [ socialLogins.userId ], references: [ users.id ] }) }));

export const subscriptionsRelations = relations(subscriptions, (helpers) => ({ userSubscriptions: helpers.many(userSubscriptions, { relationName: 'SubscriptionToUserSubscription' }) }));

export const userSubscriptionsRelations = relations(userSubscriptions, (helpers) => ({ user: helpers.one(users, { relationName: 'UserToUserSubscription', fields: [ userSubscriptions.userId ], references: [ users.id ] }), subscription: helpers.one(subscriptions, { relationName: 'SubscriptionToUserSubscription', fields: [ userSubscriptions.subscriptionId ], references: [ subscriptions.id ] }) }));

export const programsRelations = relations(programs, (helpers) => ({ routines: helpers.many(programRoutines, { relationName: 'ProgramToProgramRoutine' }), weeks: helpers.many(programWeeks, { relationName: 'ProgramToProgramWeek' }), programLogs: helpers.many(programLogs, { relationName: 'ProgramToProgramLog' }), user: helpers.one(users, { relationName: 'ProgramToUser', fields: [ programs.userId ], references: [ users.id ] }) }));

export const routinesRelations = relations(routines, (helpers) => ({ programs: helpers.many(programRoutines, { relationName: 'ProgramRoutineToRoutine' }), exercises: helpers.many(routineExercises, { relationName: 'RoutineToRoutineExercise' }), workoutLogs: helpers.many(workoutLogs, { relationName: 'RoutineToWorkoutLog' }), leaderboard: helpers.many(leaderboards, { relationName: 'LeaderboardToRoutine' }), sessions: helpers.many(workoutSessions, { relationName: 'RoutineToWorkoutSession' }), user: helpers.one(users, { relationName: 'RoutineToUser', fields: [ routines.userId ], references: [ users.id ] }) }));

export const programWeeksRelations = relations(programWeeks, (helpers) => ({ program: helpers.one(programs, { relationName: 'ProgramToProgramWeek', fields: [ programWeeks.programId ], references: [ programs.id ] }), days: helpers.many(programDays, { relationName: 'ProgramDayToProgramWeek' }) }));

export const programDaysRelations = relations(programDays, (helpers) => ({ programWeek: helpers.one(programWeeks, { relationName: 'ProgramDayToProgramWeek', fields: [ programDays.programWeekId ], references: [ programWeeks.id ] }), movementPrep: helpers.one(movementPreps, { relationName: 'MovementPrepToProgramDay', fields: [ programDays.movementPrepId ], references: [ movementPreps.id ] }), warmup: helpers.one(warmups, { relationName: 'ProgramDayToWarmup', fields: [ programDays.warmupId ], references: [ warmups.id ] }), blocks: helpers.many(programBlocks, { relationName: 'ProgramBlockToProgramDay' }), cooldown: helpers.one(cooldowns, { relationName: 'CooldownToProgramDay', fields: [ programDays.cooldownId ], references: [ cooldowns.id ] }) }));

export const programBlocksRelations = relations(programBlocks, (helpers) => ({ programDay: helpers.one(programDays, { relationName: 'ProgramBlockToProgramDay', fields: [ programBlocks.programDayId ], references: [ programDays.id ] }), exercises: helpers.many(blockExercises, { relationName: 'BlockExerciseToProgramBlock' }) }));

export const programRoutinesRelations = relations(programRoutines, (helpers) => ({ program: helpers.one(programs, { relationName: 'ProgramToProgramRoutine', fields: [ programRoutines.programId ], references: [ programs.id ] }), routine: helpers.one(routines, { relationName: 'ProgramRoutineToRoutine', fields: [ programRoutines.routineId ], references: [ routines.id ] }) }));

export const movementPrepsRelations = relations(movementPreps, (helpers) => ({ programDays: helpers.many(programDays, { relationName: 'MovementPrepToProgramDay' }), foamRolling: helpers.many(foamRollingExercises, { relationName: 'FoamRollingExerciseToMovementPrep' }), mobility: helpers.many(mobilityExercises, { relationName: 'MobilityExerciseToMovementPrep' }), activation: helpers.many(activationExercises, { relationName: 'ActivationExerciseToMovementPrep' }) }));

export const foamRollingExercisesRelations = relations(foamRollingExercises, (helpers) => ({ movementPrep: helpers.one(movementPreps, { relationName: 'FoamRollingExerciseToMovementPrep', fields: [ foamRollingExercises.movementPrepId ], references: [ movementPreps.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToFoamRollingExercise', fields: [ foamRollingExercises.exerciseId ], references: [ exercises.id ] }) }));

export const mobilityExercisesRelations = relations(mobilityExercises, (helpers) => ({ movementPrep: helpers.one(movementPreps, { relationName: 'MobilityExerciseToMovementPrep', fields: [ mobilityExercises.movementPrepId ], references: [ movementPreps.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToMobilityExercise', fields: [ mobilityExercises.exerciseId ], references: [ exercises.id ] }) }));

export const activationExercisesRelations = relations(activationExercises, (helpers) => ({ movementPrep: helpers.one(movementPreps, { relationName: 'ActivationExerciseToMovementPrep', fields: [ activationExercises.movementPrepId ], references: [ movementPreps.id ] }), exercise: helpers.one(exercises, { relationName: 'ActivationExerciseToExercise', fields: [ activationExercises.exerciseId ], references: [ exercises.id ] }) }));

export const warmupsRelations = relations(warmups, (helpers) => ({ programDays: helpers.many(programDays, { relationName: 'ProgramDayToWarmup' }), dynamic: helpers.many(dynamicExercises, { relationName: 'DynamicExerciseToWarmup' }), ladder: helpers.many(ladderExercises, { relationName: 'LadderExerciseToWarmup' }), power: helpers.many(powerExercises, { relationName: 'PowerExerciseToWarmup' }) }));

export const dynamicExercisesRelations = relations(dynamicExercises, (helpers) => ({ warmup: helpers.one(warmups, { relationName: 'DynamicExerciseToWarmup', fields: [ dynamicExercises.warmupId ], references: [ warmups.id ] }), exercise: helpers.one(exercises, { relationName: 'DynamicExerciseToExercise', fields: [ dynamicExercises.exerciseId ], references: [ exercises.id ] }) }));

export const ladderExercisesRelations = relations(ladderExercises, (helpers) => ({ warmup: helpers.one(warmups, { relationName: 'LadderExerciseToWarmup', fields: [ ladderExercises.warmupId ], references: [ warmups.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToLadderExercise', fields: [ ladderExercises.exerciseId ], references: [ exercises.id ] }) }));

export const powerExercisesRelations = relations(powerExercises, (helpers) => ({ warmup: helpers.one(warmups, { relationName: 'PowerExerciseToWarmup', fields: [ powerExercises.warmupId ], references: [ warmups.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToPowerExercise', fields: [ powerExercises.exerciseId ], references: [ exercises.id ] }) }));

export const cooldownsRelations = relations(cooldowns, (helpers) => ({ programDays: helpers.many(programDays, { relationName: 'CooldownToProgramDay' }), exercises: helpers.many(cooldownExercises, { relationName: 'CooldownToCooldownExercise' }) }));

export const cooldownExercisesRelations = relations(cooldownExercises, (helpers) => ({ cooldown: helpers.one(cooldowns, { relationName: 'CooldownToCooldownExercise', fields: [ cooldownExercises.cooldownId ], references: [ cooldowns.id ] }), exercise: helpers.one(exercises, { relationName: 'CooldownExerciseToExercise', fields: [ cooldownExercises.exerciseId ], references: [ exercises.id ] }) }));

export const exercisesRelations = relations(exercises, (helpers) => ({ routines: helpers.many(routineExercises, { relationName: 'ExerciseToRoutineExercise' }), blocks: helpers.many(blockExercises, { relationName: 'BlockExerciseToExercise' }), foamRolling: helpers.many(foamRollingExercises, { relationName: 'ExerciseToFoamRollingExercise' }), mobility: helpers.many(mobilityExercises, { relationName: 'ExerciseToMobilityExercise' }), activation: helpers.many(activationExercises, { relationName: 'ActivationExerciseToExercise' }), dynamic: helpers.many(dynamicExercises, { relationName: 'DynamicExerciseToExercise' }), ladder: helpers.many(ladderExercises, { relationName: 'ExerciseToLadderExercise' }), power: helpers.many(powerExercises, { relationName: 'ExerciseToPowerExercise' }), cooldown: helpers.many(cooldownExercises, { relationName: 'CooldownExerciseToExercise' }), exerciseLogs: helpers.many(exerciseLogs, { relationName: 'ExerciseToExerciseLog' }) }));

export const routineExercisesRelations = relations(routineExercises, (helpers) => ({ routine: helpers.one(routines, { relationName: 'RoutineToRoutineExercise', fields: [ routineExercises.routineId ], references: [ routines.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToRoutineExercise', fields: [ routineExercises.exerciseId ], references: [ exercises.id ] }) }));

export const blockExercisesRelations = relations(blockExercises, (helpers) => ({ block: helpers.one(programBlocks, { relationName: 'BlockExerciseToProgramBlock', fields: [ blockExercises.programBlockId ], references: [ programBlocks.id ] }), exercise: helpers.one(exercises, { relationName: 'BlockExerciseToExercise', fields: [ blockExercises.exerciseId ], references: [ exercises.id ] }), programExerciseLogs: helpers.many(programExerciseLogs, { relationName: 'BlockExerciseToProgramExerciseLog' }) }));

export const programLogsRelations = relations(programLogs, (helpers) => ({ user: helpers.one(users, { relationName: 'ProgramLogToUser', fields: [ programLogs.userId ], references: [ users.id ] }), program: helpers.one(programs, { relationName: 'ProgramToProgramLog', fields: [ programLogs.programId ], references: [ programs.id ] }), exerciseLogs: helpers.many(programExerciseLogs, { relationName: 'ProgramExerciseLogToProgramLog' }) }));

export const programExerciseLogsRelations = relations(programExerciseLogs, (helpers) => ({ programLog: helpers.one(programLogs, { relationName: 'ProgramExerciseLogToProgramLog', fields: [ programExerciseLogs.programLogId ], references: [ programLogs.id ] }), blockExercise: helpers.one(blockExercises, { relationName: 'BlockExerciseToProgramExerciseLog', fields: [ programExerciseLogs.programBlockId, programExerciseLogs.exerciseId ], references: [ blockExercises.programBlockId, blockExercises.exerciseId ] }), sets: helpers.many(programExerciseLogSets, { relationName: 'ProgramExerciseLogToProgramExerciseLogSet' }) }));

export const programExerciseLogSetsRelations = relations(programExerciseLogSets, (helpers) => ({ programExerciseLog: helpers.one(programExerciseLogs, { relationName: 'ProgramExerciseLogToProgramExerciseLogSet', fields: [ programExerciseLogSets.programExerciseLogId ], references: [ programExerciseLogs.id ] }) }));

export const workoutLogsRelations = relations(workoutLogs, (helpers) => ({ user: helpers.one(users, { relationName: 'UserToWorkoutLog', fields: [ workoutLogs.userId ], references: [ users.id ] }), routine: helpers.one(routines, { relationName: 'RoutineToWorkoutLog', fields: [ workoutLogs.routineId ], references: [ routines.id ] }), exerciseLogs: helpers.many(exerciseLogs, { relationName: 'ExerciseLogToWorkoutLog' }) }));

export const exerciseLogsRelations = relations(exerciseLogs, (helpers) => ({ workoutLog: helpers.one(workoutLogs, { relationName: 'ExerciseLogToWorkoutLog', fields: [ exerciseLogs.workoutLogId ], references: [ workoutLogs.id ] }), exercise: helpers.one(exercises, { relationName: 'ExerciseToExerciseLog', fields: [ exerciseLogs.exerciseId ], references: [ exercises.id ] }), sets: helpers.many(exerciseLogSets, { relationName: 'ExerciseLogToExerciseLogSet' }) }));

export const exerciseLogSetsRelations = relations(exerciseLogSets, (helpers) => ({ exerciseLog: helpers.one(exerciseLogs, { relationName: 'ExerciseLogToExerciseLogSet', fields: [ exerciseLogSets.exerciseLogId ], references: [ exerciseLogs.id ] }) }));

export const workoutSessionsRelations = relations(workoutSessions, (helpers) => ({ user: helpers.one(users, { relationName: 'UserToWorkoutSession', fields: [ workoutSessions.userId ], references: [ users.id ] }), routine: helpers.one(routines, { relationName: 'RoutineToWorkoutSession', fields: [ workoutSessions.routineId ], references: [ routines.id ] }) }));

export const coachesRelations = relations(coaches, (helpers) => ({ availability: helpers.many(availabilities, { relationName: 'AvailabilityToCoach' }), appointments: helpers.many(appointments, { relationName: 'AppointmentToCoach' }) }));

export const availabilitiesRelations = relations(availabilities, (helpers) => ({ coach: helpers.one(coaches, { relationName: 'AvailabilityToCoach', fields: [ availabilities.coachId ], references: [ coaches.id ] }) }));

export const appointmentsRelations = relations(appointments, (helpers) => ({ user: helpers.one(users, { relationName: 'AppointmentToUser', fields: [ appointments.userId ], references: [ users.id ] }), coach: helpers.one(coaches, { relationName: 'AppointmentToCoach', fields: [ appointments.coachId ], references: [ coaches.id ] }) }));

export const leaderboardsRelations = relations(leaderboards, (helpers) => ({ user: helpers.one(users, { relationName: 'LeaderboardToUser', fields: [ leaderboards.userId ], references: [ users.id ] }), routine: helpers.one(routines, { relationName: 'LeaderboardToRoutine', fields: [ leaderboards.routineId ], references: [ routines.id ] }) }));