import { relations, sql } from 'drizzle-orm'
import { boolean, decimal, doublePrecision, foreignKey, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const AppointmentType = pgEnum('AppointmentType', ['GOAL_SETTING', 'FOLLOWUP'])

export const Role = pgEnum('Role', ['admin', 'user'])

export const BalanceType = pgEnum('BalanceType', ['bilateral', 'unilateral'])

export const BalanceLevel = pgEnum('BalanceLevel', ['static', 'dynamic'])

export const BodyFocus = pgEnum('BodyFocus', ['upper', 'lower', 'core', 'full'])

export const ContractionType = pgEnum('ContractionType', ['isometric', 'isotonic'])

export const Equipment = pgEnum('Equipment', ['bodyweight', 'dumbbell', 'kettlebell', 'barbell', 'resistance_band', 'suspension', 'parallette', 'slider_discs', 'gymnastics_rings', 'foam_roller', 'medicine_ball', 'sled', 'bike', 'plyo_box', 'bench', 'cable_machine'])

export const Joint = pgEnum('Joint', ['ankle', 'knee', 'hip', 'shoulder', 'elbow', 'wrist'])

export const LiftType = pgEnum('LiftType', ['compound', 'isolation'])

export const HeightUnit = pgEnum('HeightUnit', ['inches', 'centimeters'])

export const LoadUnit = pgEnum('LoadUnit', ['bodyweight', 'kilogram', 'pound'])

export const MuscleGroup = pgEnum('MuscleGroup', ['quads', 'hamstrings', 'glutes', 'calves', 'shoulders', 'biceps', 'triceps', 'forearms', 'pecs', 'lats', 'traps', 'hip_flexors', 'erectors', 'adductors', 'abductors', 'abs', 'obliques', 'serratus', 'pelvic_floor'])

export const MovementPattern = pgEnum('MovementPattern', ['push', 'pull', 'core', 'squat', 'hinge', 'lunge', 'rotational', 'locomotive'])

export const MovementPlane = pgEnum('MovementPlane', ['frontal', 'sagittal', 'transverse'])

export const StretchType = pgEnum('StretchType', ['static', 'dynamic'])

export const SectionType = pgEnum('SectionType', ['warmup', 'main', 'cooldown'])

export const GroupType = pgEnum('GroupType', ['circuit', 'regular'])

export const ExerciseTarget = pgEnum('ExerciseTarget', ['reps', 'time'])

export const Side = pgEnum('Side', ['left', 'right', 'none'])

export const Recurrence = pgEnum('Recurrence', ['DAILY', 'WEEKLY', 'MONTHLY'])

export const User = pgTable('User', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	email: text('email').notNull().unique(),
	passwordHash: text('passwordHash'),
	profilePhotoUrl: text('profilePhotoUrl'),
	profilePhotoId: text('profilePhotoId'),
	firstName: text('firstName').notNull(),
	lastName: text('lastName').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
	role: Role('role').notNull()
});

export const FitnessProfile = pgTable('FitnessProfile', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull().unique(),
	heightUnit: HeightUnit('heightUnit').notNull().default("inches"),
	height: integer('height'),
	unit: LoadUnit('unit').notNull().default("pound"),
	currentWeight: integer('currentWeight'),
	targetWeight: integer('targetWeight'),
	goal_fatLoss: boolean('goal_fatLoss'),
	goal_endurance: boolean('goal_endurance'),
	goal_buildMuscle: boolean('goal_buildMuscle'),
	goal_loseWeight: boolean('goal_loseWeight'),
	goal_improveBalance: boolean('goal_improveBalance'),
	goal_improveFlexibility: boolean('goal_improveFlexibility'),
	goal_learnNewSkills: boolean('goal_learnNewSkills'),
	parq_heartCondition: boolean('parq_heartCondition'),
	parq_chestPainActivity: boolean('parq_chestPainActivity'),
	parq_chestPainNoActivity: boolean('parq_chestPainNoActivity'),
	parq_balanceConsciousness: boolean('parq_balanceConsciousness'),
	parq_boneJoint: boolean('parq_boneJoint'),
	parq_bloodPressureMeds: boolean('parq_bloodPressureMeds'),
	parq_otherReasons: boolean('parq_otherReasons'),
	operational_occupation: text('operational_occupation'),
	operational_extendedSitting: boolean('operational_extendedSitting'),
	operational_repetitiveMovements: boolean('operational_repetitiveMovements'),
	operational_explanation_repetitiveMovements: text('operational_explanation_repetitiveMovements'),
	operational_heelShoes: boolean('operational_heelShoes'),
	operational_mentalStress: boolean('operational_mentalStress'),
	recreational_physicalActivities: boolean('recreational_physicalActivities'),
	recreational_explanation_physicalActivities: text('recreational_explanation_physicalActivities'),
	recreational_hobbies: boolean('recreational_hobbies'),
	recreational_explanation_hobbies: text('recreational_explanation_hobbies'),
	medical_injuriesPain: boolean('medical_injuriesPain'),
	medical_explanation_injuriesPain: text('medical_explanation_injuriesPain'),
	medical_surgeries: boolean('medical_surgeries'),
	medical_explanation_surgeries: text('medical_explanation_surgeries'),
	medical_chronicDisease: boolean('medical_chronicDisease'),
	medical_explanation_chronicDisease: text('medical_explanation_chronicDisease'),
	medical_medications: boolean('medical_medications'),
	medical_explanation_medications: text('medical_explanation_medications')
}, (FitnessProfile) => ({
	'FitnessProfile_user_fkey': foreignKey({
		name: 'FitnessProfile_user_fkey',
		columns: [FitnessProfile.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const SocialLogin = pgTable('SocialLogin', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	provider: text('provider').notNull(),
	providerUserId: text('providerUserId').notNull(),
	userId: text('userId').notNull()
}, (SocialLogin) => ({
	'SocialLogin_user_fkey': foreignKey({
		name: 'SocialLogin_user_fkey',
		columns: [SocialLogin.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'SocialLogin_provider_providerUserId_unique_idx': uniqueIndex('SocialLogin_provider_providerUserId_key')
		.on(SocialLogin.provider, SocialLogin.providerUserId)
}));

export const Subscription = pgTable('Subscription', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	price: decimal('price', { precision: 65, scale: 30 }).notNull(),
	description: text('description')
});

export const UserSubscription = pgTable('UserSubscription', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	subscriptionId: text('subscriptionId').notNull(),
	startDate: timestamp('startDate', { precision: 3 }).notNull(),
	endDate: timestamp('endDate', { precision: 3 })
}, (UserSubscription) => ({
	'UserSubscription_user_fkey': foreignKey({
		name: 'UserSubscription_user_fkey',
		columns: [UserSubscription.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'UserSubscription_subscription_fkey': foreignKey({
		name: 'UserSubscription_subscription_fkey',
		columns: [UserSubscription.subscriptionId],
		foreignColumns: [Subscription.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Program = pgTable('Program', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description'),
	isFree: boolean('isFree').notNull(),
	price: decimal('price', { precision: 65, scale: 30 }),
	youtubeLink: text('youtubeLink'),
	s3ImageKey: text('s3ImageKey'),
	s3VideoKey: text('s3VideoKey'),
	muxPlaybackId: text('muxPlaybackId'),
	userId: text('userId')
}, (Program) => ({
	'Program_user_fkey': foreignKey({
		name: 'Program_user_fkey',
		columns: [Program.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Routine = pgTable('Routine', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description'),
	isFree: boolean('isFree'),
	youtubeLink: text('youtubeLink'),
	s3ImageKey: text('s3ImageKey'),
	s3VideoKey: text('s3VideoKey'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	userId: text('userId')
}, (Routine) => ({
	'Routine_user_fkey': foreignKey({
		name: 'Routine_user_fkey',
		columns: [Routine.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramWeek = pgTable('ProgramWeek', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	programId: text('programId').notNull(),
	weekNumber: integer('weekNumber').notNull()
}, (ProgramWeek) => ({
	'ProgramWeek_program_fkey': foreignKey({
		name: 'ProgramWeek_program_fkey',
		columns: [ProgramWeek.programId],
		foreignColumns: [Program.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramDay = pgTable('ProgramDay', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	programWeekId: text('programWeekId').notNull(),
	dayNumber: integer('dayNumber').notNull(),
	movementPrepId: text('movementPrepId').notNull(),
	warmupId: text('warmupId').notNull(),
	cooldownId: text('cooldownId').notNull()
}, (ProgramDay) => ({
	'ProgramDay_programWeek_fkey': foreignKey({
		name: 'ProgramDay_programWeek_fkey',
		columns: [ProgramDay.programWeekId],
		foreignColumns: [ProgramWeek.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramDay_movementPrep_fkey': foreignKey({
		name: 'ProgramDay_movementPrep_fkey',
		columns: [ProgramDay.movementPrepId],
		foreignColumns: [MovementPrep.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramDay_warmup_fkey': foreignKey({
		name: 'ProgramDay_warmup_fkey',
		columns: [ProgramDay.warmupId],
		foreignColumns: [Warmup.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramDay_cooldown_fkey': foreignKey({
		name: 'ProgramDay_cooldown_fkey',
		columns: [ProgramDay.cooldownId],
		foreignColumns: [Cooldown.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramBlock = pgTable('ProgramBlock', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	programDayId: text('programDayId').notNull(),
	blockNumber: integer('blockNumber').notNull()
}, (ProgramBlock) => ({
	'ProgramBlock_programDay_fkey': foreignKey({
		name: 'ProgramBlock_programDay_fkey',
		columns: [ProgramBlock.programDayId],
		foreignColumns: [ProgramDay.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramRoutine = pgTable('ProgramRoutine', {
	programId: text('programId').notNull(),
	routineId: text('routineId').notNull()
}, (ProgramRoutine) => ({
	'ProgramRoutine_program_fkey': foreignKey({
		name: 'ProgramRoutine_program_fkey',
		columns: [ProgramRoutine.programId],
		foreignColumns: [Program.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramRoutine_routine_fkey': foreignKey({
		name: 'ProgramRoutine_routine_fkey',
		columns: [ProgramRoutine.routineId],
		foreignColumns: [Routine.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramRoutine_cpk': primaryKey({
		name: 'ProgramRoutine_cpk',
		columns: [ProgramRoutine.programId, ProgramRoutine.routineId]
	})
}));

export const MovementPrep = pgTable('MovementPrep', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description')
});

export const FoamRollingExercise = pgTable('FoamRollingExercise', {
	movementPrepId: text('movementPrepId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull(),
	time: integer('time')
}, (FoamRollingExercise) => ({
	'FoamRollingExercise_movementPrep_fkey': foreignKey({
		name: 'FoamRollingExercise_movementPrep_fkey',
		columns: [FoamRollingExercise.movementPrepId],
		foreignColumns: [MovementPrep.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'FoamRollingExercise_exercise_fkey': foreignKey({
		name: 'FoamRollingExercise_exercise_fkey',
		columns: [FoamRollingExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'FoamRollingExercise_cpk': primaryKey({
		name: 'FoamRollingExercise_cpk',
		columns: [FoamRollingExercise.movementPrepId, FoamRollingExercise.exerciseId]
	})
}));

export const MobilityExercise = pgTable('MobilityExercise', {
	movementPrepId: text('movementPrepId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull(),
	time: integer('time')
}, (MobilityExercise) => ({
	'MobilityExercise_movementPrep_fkey': foreignKey({
		name: 'MobilityExercise_movementPrep_fkey',
		columns: [MobilityExercise.movementPrepId],
		foreignColumns: [MovementPrep.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'MobilityExercise_exercise_fkey': foreignKey({
		name: 'MobilityExercise_exercise_fkey',
		columns: [MobilityExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'MobilityExercise_cpk': primaryKey({
		name: 'MobilityExercise_cpk',
		columns: [MobilityExercise.movementPrepId, MobilityExercise.exerciseId]
	})
}));

export const ActivationExercise = pgTable('ActivationExercise', {
	movementPrepId: text('movementPrepId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull(),
	time: integer('time')
}, (ActivationExercise) => ({
	'ActivationExercise_movementPrep_fkey': foreignKey({
		name: 'ActivationExercise_movementPrep_fkey',
		columns: [ActivationExercise.movementPrepId],
		foreignColumns: [MovementPrep.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ActivationExercise_exercise_fkey': foreignKey({
		name: 'ActivationExercise_exercise_fkey',
		columns: [ActivationExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ActivationExercise_cpk': primaryKey({
		name: 'ActivationExercise_cpk',
		columns: [ActivationExercise.movementPrepId, ActivationExercise.exerciseId]
	})
}));

export const Warmup = pgTable('Warmup', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description')
});

export const DynamicExercise = pgTable('DynamicExercise', {
	warmupId: text('warmupId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull()
}, (DynamicExercise) => ({
	'DynamicExercise_warmup_fkey': foreignKey({
		name: 'DynamicExercise_warmup_fkey',
		columns: [DynamicExercise.warmupId],
		foreignColumns: [Warmup.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'DynamicExercise_exercise_fkey': foreignKey({
		name: 'DynamicExercise_exercise_fkey',
		columns: [DynamicExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'DynamicExercise_cpk': primaryKey({
		name: 'DynamicExercise_cpk',
		columns: [DynamicExercise.warmupId, DynamicExercise.exerciseId]
	})
}));

export const LadderExercise = pgTable('LadderExercise', {
	warmupId: text('warmupId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull()
}, (LadderExercise) => ({
	'LadderExercise_warmup_fkey': foreignKey({
		name: 'LadderExercise_warmup_fkey',
		columns: [LadderExercise.warmupId],
		foreignColumns: [Warmup.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'LadderExercise_exercise_fkey': foreignKey({
		name: 'LadderExercise_exercise_fkey',
		columns: [LadderExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'LadderExercise_cpk': primaryKey({
		name: 'LadderExercise_cpk',
		columns: [LadderExercise.warmupId, LadderExercise.exerciseId]
	})
}));

export const PowerExercise = pgTable('PowerExercise', {
	warmupId: text('warmupId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps').notNull()
}, (PowerExercise) => ({
	'PowerExercise_warmup_fkey': foreignKey({
		name: 'PowerExercise_warmup_fkey',
		columns: [PowerExercise.warmupId],
		foreignColumns: [Warmup.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'PowerExercise_exercise_fkey': foreignKey({
		name: 'PowerExercise_exercise_fkey',
		columns: [PowerExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'PowerExercise_cpk': primaryKey({
		name: 'PowerExercise_cpk',
		columns: [PowerExercise.warmupId, PowerExercise.exerciseId]
	})
}));

export const Cooldown = pgTable('Cooldown', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description')
});

export const CooldownExercise = pgTable('CooldownExercise', {
	cooldownId: text('cooldownId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	reps: integer('reps'),
	time: integer('time')
}, (CooldownExercise) => ({
	'CooldownExercise_cooldown_fkey': foreignKey({
		name: 'CooldownExercise_cooldown_fkey',
		columns: [CooldownExercise.cooldownId],
		foreignColumns: [Cooldown.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'CooldownExercise_exercise_fkey': foreignKey({
		name: 'CooldownExercise_exercise_fkey',
		columns: [CooldownExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'CooldownExercise_cpk': primaryKey({
		name: 'CooldownExercise_cpk',
		columns: [CooldownExercise.cooldownId, CooldownExercise.exerciseId]
	})
}));

export const Exercise = pgTable('Exercise', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description'),
	isFree: boolean('isFree').notNull(),
	cues: text('cues').array().notNull(),
	tips: text('tips').array().notNull(),
	youtubeLink: text('youtubeLink'),
	s3ImageKey: text('s3ImageKey'),
	s3VideoKey: text('s3VideoKey'),
	muxPlaybackId: text('muxPlaybackId'),
	tags: text('tags').array().notNull(),
	balance: BalanceType('balance'),
	balanceLevel: BalanceLevel('balanceLevel'),
	body: BodyFocus('body').array().notNull(),
	contraction: ContractionType('contraction'),
	equipment: Equipment('equipment').array().notNull(),
	joint: Joint('joint').array().notNull(),
	lift: LiftType('lift'),
	muscles: MuscleGroup('muscles').array().notNull(),
	pattern: MovementPattern('pattern').array().notNull(),
	plane: MovementPlane('plane').array().notNull(),
	stretch: StretchType('stretch'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const RoutineExercise = pgTable('RoutineExercise', {
	routineId: text('routineId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	orderInRoutine: integer('orderInRoutine').notNull(),
	circuitId: text('circuitId'),
	sets: text('sets'),
	target: ExerciseTarget('target').notNull(),
	reps: text('reps'),
	time: text('time'),
	notes: text('notes'),
	rest: text('rest').notNull(),
	rpe: integer('rpe').notNull().default(1),
	side: Side('side')
}, (RoutineExercise) => ({
	'RoutineExercise_routine_fkey': foreignKey({
		name: 'RoutineExercise_routine_fkey',
		columns: [RoutineExercise.routineId],
		foreignColumns: [Routine.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'RoutineExercise_exercise_fkey': foreignKey({
		name: 'RoutineExercise_exercise_fkey',
		columns: [RoutineExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'RoutineExercise_cpk': primaryKey({
		name: 'RoutineExercise_cpk',
		columns: [RoutineExercise.routineId, RoutineExercise.exerciseId]
	})
}));

export const BlockExercise = pgTable('BlockExercise', {
	programBlockId: text('programBlockId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	orderInBlock: integer('orderInBlock').notNull(),
	sets: integer('sets'),
	target: ExerciseTarget('target').notNull(),
	reps: integer('reps'),
	time: integer('time'),
	notes: text('notes'),
	rest: integer('rest'),
	side: Side('side')
}, (BlockExercise) => ({
	'BlockExercise_block_fkey': foreignKey({
		name: 'BlockExercise_block_fkey',
		columns: [BlockExercise.programBlockId],
		foreignColumns: [ProgramBlock.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'BlockExercise_exercise_fkey': foreignKey({
		name: 'BlockExercise_exercise_fkey',
		columns: [BlockExercise.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'BlockExercise_cpk': primaryKey({
		name: 'BlockExercise_cpk',
		columns: [BlockExercise.programBlockId, BlockExercise.exerciseId]
	})
}));

export const ProgramLog = pgTable('ProgramLog', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	programId: text('programId').notNull(),
	programWeek: integer('programWeek').notNull().default(1),
	programDay: integer('programDay').notNull().default(1),
	date: timestamp('date', { precision: 3 }).notNull().defaultNow(),
	duration: text('duration').notNull()
}, (ProgramLog) => ({
	'ProgramLog_user_fkey': foreignKey({
		name: 'ProgramLog_user_fkey',
		columns: [ProgramLog.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramLog_program_fkey': foreignKey({
		name: 'ProgramLog_program_fkey',
		columns: [ProgramLog.programId],
		foreignColumns: [Program.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramExerciseLog = pgTable('ProgramExerciseLog', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	programLogId: text('programLogId').notNull(),
	programBlockId: text('programBlockId').notNull(),
	exerciseId: text('exerciseId').notNull()
}, (ProgramExerciseLog) => ({
	'ProgramExerciseLog_programLog_fkey': foreignKey({
		name: 'ProgramExerciseLog_programLog_fkey',
		columns: [ProgramExerciseLog.programLogId],
		foreignColumns: [ProgramLog.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ProgramExerciseLog_blockExercise_fkey': foreignKey({
		name: 'ProgramExerciseLog_blockExercise_fkey',
		columns: [ProgramExerciseLog.programBlockId, ProgramExerciseLog.exerciseId],
		foreignColumns: [BlockExercise.programBlockId, BlockExercise.exerciseId]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ProgramExerciseLogSet = pgTable('ProgramExerciseLogSet', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	programExerciseLogId: text('programExerciseLogId').notNull(),
	set: text('set').notNull(),
	actualReps: text('actualReps'),
	load: doublePrecision('load'),
	notes: text('notes'),
	unit: LoadUnit('unit').notNull().default("pound")
}, (ProgramExerciseLogSet) => ({
	'ProgramExerciseLogSet_programExerciseLog_fkey': foreignKey({
		name: 'ProgramExerciseLogSet_programExerciseLog_fkey',
		columns: [ProgramExerciseLogSet.programExerciseLogId],
		foreignColumns: [ProgramExerciseLog.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const WorkoutLog = pgTable('WorkoutLog', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	routineId: text('routineId').notNull(),
	date: timestamp('date', { precision: 3 }).notNull().defaultNow(),
	duration: text('duration').notNull()
}, (WorkoutLog) => ({
	'WorkoutLog_user_fkey': foreignKey({
		name: 'WorkoutLog_user_fkey',
		columns: [WorkoutLog.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'WorkoutLog_routine_fkey': foreignKey({
		name: 'WorkoutLog_routine_fkey',
		columns: [WorkoutLog.routineId],
		foreignColumns: [Routine.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ExerciseLog = pgTable('ExerciseLog', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	workoutLogId: text('workoutLogId').notNull(),
	exerciseId: text('exerciseId').notNull(),
	circuitId: text('circuitId'),
	orderInRoutine: integer('orderInRoutine').notNull(),
	target: ExerciseTarget('target').notNull(),
	time: text('time'),
	targetReps: text('targetReps')
}, (ExerciseLog) => ({
	'ExerciseLog_workoutLog_fkey': foreignKey({
		name: 'ExerciseLog_workoutLog_fkey',
		columns: [ExerciseLog.workoutLogId],
		foreignColumns: [WorkoutLog.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'ExerciseLog_exercise_fkey': foreignKey({
		name: 'ExerciseLog_exercise_fkey',
		columns: [ExerciseLog.exerciseId],
		foreignColumns: [Exercise.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const ExerciseLogSet = pgTable('ExerciseLogSet', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	exerciseLogId: text('exerciseLogId').notNull(),
	set: text('set').notNull(),
	actualReps: text('actualReps'),
	load: doublePrecision('load'),
	notes: text('notes'),
	unit: LoadUnit('unit').notNull().default("pound")
}, (ExerciseLogSet) => ({
	'ExerciseLogSet_exerciseLog_fkey': foreignKey({
		name: 'ExerciseLogSet_exerciseLog_fkey',
		columns: [ExerciseLogSet.exerciseLogId],
		foreignColumns: [ExerciseLog.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const WorkoutSession = pgTable('WorkoutSession', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	routineId: text('routineId').notNull(),
	startTime: timestamp('startTime', { precision: 3 }).notNull(),
	endTime: timestamp('endTime', { precision: 3 }).notNull(),
	recurrence: Recurrence('recurrence')
}, (WorkoutSession) => ({
	'WorkoutSession_user_fkey': foreignKey({
		name: 'WorkoutSession_user_fkey',
		columns: [WorkoutSession.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'WorkoutSession_routine_fkey': foreignKey({
		name: 'WorkoutSession_routine_fkey',
		columns: [WorkoutSession.routineId],
		foreignColumns: [Routine.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Coach = pgTable('Coach', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull()
});

export const Availability = pgTable('Availability', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	coachId: text('coachId').notNull(),
	dayOfWeek: integer('dayOfWeek').notNull(),
	startTime: timestamp('startTime', { precision: 3 }).notNull(),
	endTime: timestamp('endTime', { precision: 3 }).notNull()
}, (Availability) => ({
	'Availability_coach_fkey': foreignKey({
		name: 'Availability_coach_fkey',
		columns: [Availability.coachId],
		foreignColumns: [Coach.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Appointment = pgTable('Appointment', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	coachId: text('coachId').notNull(),
	startTime: timestamp('startTime', { precision: 3 }).notNull(),
	endTime: timestamp('endTime', { precision: 3 }).notNull(),
	type: AppointmentType('type').notNull()
}, (Appointment) => ({
	'Appointment_user_fkey': foreignKey({
		name: 'Appointment_user_fkey',
		columns: [Appointment.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Appointment_coach_fkey': foreignKey({
		name: 'Appointment_coach_fkey',
		columns: [Appointment.coachId],
		foreignColumns: [Coach.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const FMS = pgTable('FMS', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	userId: text('userId').notNull(),
	deep_squat: integer('deep_squat').notNull(),
	hurdle_step: integer('hurdle_step').notNull(),
	inline_lunge: integer('inline_lunge').notNull(),
	shoulder_mobility: integer('shoulder_mobility').notNull(),
	active_straight_leg_raise: integer('active_straight_leg_raise').notNull(),
	trunk_stability_pushup: integer('trunk_stability_pushup').notNull(),
	rotary_stability: integer('rotary_stability').notNull(),
	total_score: integer('total_score').notNull(),
	date: timestamp('date', { precision: 3 }).notNull().defaultNow()
}, (FMS) => ({
	'FMS_user_fkey': foreignKey({
		name: 'FMS_user_fkey',
		columns: [FMS.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Leaderboard = pgTable('Leaderboard', {
	id: serial('id').notNull().primaryKey(),
	userId: text('userId').notNull(),
	routineId: text('routineId').notNull(),
	score: integer('score').notNull(),
	date: timestamp('date', { precision: 3 }).notNull().defaultNow()
}, (Leaderboard) => ({
	'Leaderboard_user_fkey': foreignKey({
		name: 'Leaderboard_user_fkey',
		columns: [Leaderboard.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Leaderboard_routine_fkey': foreignKey({
		name: 'Leaderboard_routine_fkey',
		columns: [Leaderboard.routineId],
		foreignColumns: [Routine.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const UserRelations = relations(User, ({ many }) => ({
	socialLogins: many(SocialLogin, {
		relationName: 'SocialLoginToUser'
	}),
	userSubscriptions: many(UserSubscription, {
		relationName: 'UserToUserSubscription'
	}),
	workoutLogs: many(WorkoutLog, {
		relationName: 'UserToWorkoutLog'
	}),
	programLogs: many(ProgramLog, {
		relationName: 'ProgramLogToUser'
	}),
	userRoutines: many(Routine, {
		relationName: 'RoutineToUser'
	}),
	userPrograms: many(Program, {
		relationName: 'ProgramToUser'
	}),
	leaderboardScores: many(Leaderboard, {
		relationName: 'LeaderboardToUser'
	}),
	scheduledWorkouts: many(WorkoutSession, {
		relationName: 'UserToWorkoutSession'
	}),
	scheduledAppointments: many(Appointment, {
		relationName: 'AppointmentToUser'
	}),
	fmsScores: many(FMS, {
		relationName: 'FMSToUser'
	}),
	fitnessProfile: many(FitnessProfile, {
		relationName: 'FitnessProfileToUser'
	})
}));

export const FitnessProfileRelations = relations(FitnessProfile, ({ one }) => ({
	user: one(User, {
		relationName: 'FitnessProfileToUser',
		fields: [FitnessProfile.userId],
		references: [User.id]
	})
}));

export const SocialLoginRelations = relations(SocialLogin, ({ one }) => ({
	user: one(User, {
		relationName: 'SocialLoginToUser',
		fields: [SocialLogin.userId],
		references: [User.id]
	})
}));

export const SubscriptionRelations = relations(Subscription, ({ many }) => ({
	userSubscriptions: many(UserSubscription, {
		relationName: 'SubscriptionToUserSubscription'
	})
}));

export const UserSubscriptionRelations = relations(UserSubscription, ({ one }) => ({
	user: one(User, {
		relationName: 'UserToUserSubscription',
		fields: [UserSubscription.userId],
		references: [User.id]
	}),
	subscription: one(Subscription, {
		relationName: 'SubscriptionToUserSubscription',
		fields: [UserSubscription.subscriptionId],
		references: [Subscription.id]
	})
}));

export const ProgramRelations = relations(Program, ({ many, one }) => ({
	routines: many(ProgramRoutine, {
		relationName: 'ProgramToProgramRoutine'
	}),
	weeks: many(ProgramWeek, {
		relationName: 'ProgramToProgramWeek'
	}),
	programLogs: many(ProgramLog, {
		relationName: 'ProgramToProgramLog'
	}),
	user: one(User, {
		relationName: 'ProgramToUser',
		fields: [Program.userId],
		references: [User.id]
	})
}));

export const RoutineRelations = relations(Routine, ({ many, one }) => ({
	programs: many(ProgramRoutine, {
		relationName: 'ProgramRoutineToRoutine'
	}),
	exercises: many(RoutineExercise, {
		relationName: 'RoutineToRoutineExercise'
	}),
	workoutLogs: many(WorkoutLog, {
		relationName: 'RoutineToWorkoutLog'
	}),
	leaderboard: many(Leaderboard, {
		relationName: 'LeaderboardToRoutine'
	}),
	sessions: many(WorkoutSession, {
		relationName: 'RoutineToWorkoutSession'
	}),
	user: one(User, {
		relationName: 'RoutineToUser',
		fields: [Routine.userId],
		references: [User.id]
	})
}));

export const ProgramWeekRelations = relations(ProgramWeek, ({ one, many }) => ({
	program: one(Program, {
		relationName: 'ProgramToProgramWeek',
		fields: [ProgramWeek.programId],
		references: [Program.id]
	}),
	days: many(ProgramDay, {
		relationName: 'ProgramDayToProgramWeek'
	})
}));

export const ProgramDayRelations = relations(ProgramDay, ({ one, many }) => ({
	programWeek: one(ProgramWeek, {
		relationName: 'ProgramDayToProgramWeek',
		fields: [ProgramDay.programWeekId],
		references: [ProgramWeek.id]
	}),
	movementPrep: one(MovementPrep, {
		relationName: 'MovementPrepToProgramDay',
		fields: [ProgramDay.movementPrepId],
		references: [MovementPrep.id]
	}),
	warmup: one(Warmup, {
		relationName: 'ProgramDayToWarmup',
		fields: [ProgramDay.warmupId],
		references: [Warmup.id]
	}),
	blocks: many(ProgramBlock, {
		relationName: 'ProgramBlockToProgramDay'
	}),
	cooldown: one(Cooldown, {
		relationName: 'CooldownToProgramDay',
		fields: [ProgramDay.cooldownId],
		references: [Cooldown.id]
	})
}));

export const ProgramBlockRelations = relations(ProgramBlock, ({ one, many }) => ({
	programDay: one(ProgramDay, {
		relationName: 'ProgramBlockToProgramDay',
		fields: [ProgramBlock.programDayId],
		references: [ProgramDay.id]
	}),
	exercises: many(BlockExercise, {
		relationName: 'BlockExerciseToProgramBlock'
	})
}));

export const ProgramRoutineRelations = relations(ProgramRoutine, ({ one }) => ({
	program: one(Program, {
		relationName: 'ProgramToProgramRoutine',
		fields: [ProgramRoutine.programId],
		references: [Program.id]
	}),
	routine: one(Routine, {
		relationName: 'ProgramRoutineToRoutine',
		fields: [ProgramRoutine.routineId],
		references: [Routine.id]
	})
}));

export const MovementPrepRelations = relations(MovementPrep, ({ many }) => ({
	programDays: many(ProgramDay, {
		relationName: 'MovementPrepToProgramDay'
	}),
	foamRolling: many(FoamRollingExercise, {
		relationName: 'FoamRollingExerciseToMovementPrep'
	}),
	mobility: many(MobilityExercise, {
		relationName: 'MobilityExerciseToMovementPrep'
	}),
	activation: many(ActivationExercise, {
		relationName: 'ActivationExerciseToMovementPrep'
	})
}));

export const FoamRollingExerciseRelations = relations(FoamRollingExercise, ({ one }) => ({
	movementPrep: one(MovementPrep, {
		relationName: 'FoamRollingExerciseToMovementPrep',
		fields: [FoamRollingExercise.movementPrepId],
		references: [MovementPrep.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToFoamRollingExercise',
		fields: [FoamRollingExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const MobilityExerciseRelations = relations(MobilityExercise, ({ one }) => ({
	movementPrep: one(MovementPrep, {
		relationName: 'MobilityExerciseToMovementPrep',
		fields: [MobilityExercise.movementPrepId],
		references: [MovementPrep.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToMobilityExercise',
		fields: [MobilityExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const ActivationExerciseRelations = relations(ActivationExercise, ({ one }) => ({
	movementPrep: one(MovementPrep, {
		relationName: 'ActivationExerciseToMovementPrep',
		fields: [ActivationExercise.movementPrepId],
		references: [MovementPrep.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ActivationExerciseToExercise',
		fields: [ActivationExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const WarmupRelations = relations(Warmup, ({ many }) => ({
	programDays: many(ProgramDay, {
		relationName: 'ProgramDayToWarmup'
	}),
	dynamic: many(DynamicExercise, {
		relationName: 'DynamicExerciseToWarmup'
	}),
	ladder: many(LadderExercise, {
		relationName: 'LadderExerciseToWarmup'
	}),
	power: many(PowerExercise, {
		relationName: 'PowerExerciseToWarmup'
	})
}));

export const DynamicExerciseRelations = relations(DynamicExercise, ({ one }) => ({
	warmup: one(Warmup, {
		relationName: 'DynamicExerciseToWarmup',
		fields: [DynamicExercise.warmupId],
		references: [Warmup.id]
	}),
	exercise: one(Exercise, {
		relationName: 'DynamicExerciseToExercise',
		fields: [DynamicExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const LadderExerciseRelations = relations(LadderExercise, ({ one }) => ({
	warmup: one(Warmup, {
		relationName: 'LadderExerciseToWarmup',
		fields: [LadderExercise.warmupId],
		references: [Warmup.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToLadderExercise',
		fields: [LadderExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const PowerExerciseRelations = relations(PowerExercise, ({ one }) => ({
	warmup: one(Warmup, {
		relationName: 'PowerExerciseToWarmup',
		fields: [PowerExercise.warmupId],
		references: [Warmup.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToPowerExercise',
		fields: [PowerExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const CooldownRelations = relations(Cooldown, ({ many }) => ({
	programDays: many(ProgramDay, {
		relationName: 'CooldownToProgramDay'
	}),
	exercises: many(CooldownExercise, {
		relationName: 'CooldownToCooldownExercise'
	})
}));

export const CooldownExerciseRelations = relations(CooldownExercise, ({ one }) => ({
	cooldown: one(Cooldown, {
		relationName: 'CooldownToCooldownExercise',
		fields: [CooldownExercise.cooldownId],
		references: [Cooldown.id]
	}),
	exercise: one(Exercise, {
		relationName: 'CooldownExerciseToExercise',
		fields: [CooldownExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const ExerciseRelations = relations(Exercise, ({ many }) => ({
	routines: many(RoutineExercise, {
		relationName: 'ExerciseToRoutineExercise'
	}),
	blocks: many(BlockExercise, {
		relationName: 'BlockExerciseToExercise'
	}),
	foamRolling: many(FoamRollingExercise, {
		relationName: 'ExerciseToFoamRollingExercise'
	}),
	mobility: many(MobilityExercise, {
		relationName: 'ExerciseToMobilityExercise'
	}),
	activation: many(ActivationExercise, {
		relationName: 'ActivationExerciseToExercise'
	}),
	dynamic: many(DynamicExercise, {
		relationName: 'DynamicExerciseToExercise'
	}),
	ladder: many(LadderExercise, {
		relationName: 'ExerciseToLadderExercise'
	}),
	power: many(PowerExercise, {
		relationName: 'ExerciseToPowerExercise'
	}),
	cooldown: many(CooldownExercise, {
		relationName: 'CooldownExerciseToExercise'
	}),
	exerciseLogs: many(ExerciseLog, {
		relationName: 'ExerciseToExerciseLog'
	})
}));

export const RoutineExerciseRelations = relations(RoutineExercise, ({ one }) => ({
	routine: one(Routine, {
		relationName: 'RoutineToRoutineExercise',
		fields: [RoutineExercise.routineId],
		references: [Routine.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToRoutineExercise',
		fields: [RoutineExercise.exerciseId],
		references: [Exercise.id]
	})
}));

export const BlockExerciseRelations = relations(BlockExercise, ({ one, many }) => ({
	block: one(ProgramBlock, {
		relationName: 'BlockExerciseToProgramBlock',
		fields: [BlockExercise.programBlockId],
		references: [ProgramBlock.id]
	}),
	exercise: one(Exercise, {
		relationName: 'BlockExerciseToExercise',
		fields: [BlockExercise.exerciseId],
		references: [Exercise.id]
	}),
	programExerciseLogs: many(ProgramExerciseLog, {
		relationName: 'BlockExerciseToProgramExerciseLog'
	})
}));

export const ProgramLogRelations = relations(ProgramLog, ({ one, many }) => ({
	user: one(User, {
		relationName: 'ProgramLogToUser',
		fields: [ProgramLog.userId],
		references: [User.id]
	}),
	program: one(Program, {
		relationName: 'ProgramToProgramLog',
		fields: [ProgramLog.programId],
		references: [Program.id]
	}),
	exerciseLogs: many(ProgramExerciseLog, {
		relationName: 'ProgramExerciseLogToProgramLog'
	})
}));

export const ProgramExerciseLogRelations = relations(ProgramExerciseLog, ({ one, many }) => ({
	programLog: one(ProgramLog, {
		relationName: 'ProgramExerciseLogToProgramLog',
		fields: [ProgramExerciseLog.programLogId],
		references: [ProgramLog.id]
	}),
	blockExercise: one(BlockExercise, {
		relationName: 'BlockExerciseToProgramExerciseLog',
		fields: [ProgramExerciseLog.programBlockId, ProgramExerciseLog.exerciseId],
		references: [BlockExercise.programBlockId, BlockExercise.exerciseId]
	}),
	sets: many(ProgramExerciseLogSet, {
		relationName: 'ProgramExerciseLogToProgramExerciseLogSet'
	})
}));

export const ProgramExerciseLogSetRelations = relations(ProgramExerciseLogSet, ({ one }) => ({
	programExerciseLog: one(ProgramExerciseLog, {
		relationName: 'ProgramExerciseLogToProgramExerciseLogSet',
		fields: [ProgramExerciseLogSet.programExerciseLogId],
		references: [ProgramExerciseLog.id]
	})
}));

export const WorkoutLogRelations = relations(WorkoutLog, ({ one, many }) => ({
	user: one(User, {
		relationName: 'UserToWorkoutLog',
		fields: [WorkoutLog.userId],
		references: [User.id]
	}),
	routine: one(Routine, {
		relationName: 'RoutineToWorkoutLog',
		fields: [WorkoutLog.routineId],
		references: [Routine.id]
	}),
	exerciseLogs: many(ExerciseLog, {
		relationName: 'ExerciseLogToWorkoutLog'
	})
}));

export const ExerciseLogRelations = relations(ExerciseLog, ({ one, many }) => ({
	workoutLog: one(WorkoutLog, {
		relationName: 'ExerciseLogToWorkoutLog',
		fields: [ExerciseLog.workoutLogId],
		references: [WorkoutLog.id]
	}),
	exercise: one(Exercise, {
		relationName: 'ExerciseToExerciseLog',
		fields: [ExerciseLog.exerciseId],
		references: [Exercise.id]
	}),
	sets: many(ExerciseLogSet, {
		relationName: 'ExerciseLogToExerciseLogSet'
	})
}));

export const ExerciseLogSetRelations = relations(ExerciseLogSet, ({ one }) => ({
	exerciseLog: one(ExerciseLog, {
		relationName: 'ExerciseLogToExerciseLogSet',
		fields: [ExerciseLogSet.exerciseLogId],
		references: [ExerciseLog.id]
	})
}));

export const WorkoutSessionRelations = relations(WorkoutSession, ({ one }) => ({
	user: one(User, {
		relationName: 'UserToWorkoutSession',
		fields: [WorkoutSession.userId],
		references: [User.id]
	}),
	routine: one(Routine, {
		relationName: 'RoutineToWorkoutSession',
		fields: [WorkoutSession.routineId],
		references: [Routine.id]
	})
}));

export const CoachRelations = relations(Coach, ({ many }) => ({
	availability: many(Availability, {
		relationName: 'AvailabilityToCoach'
	}),
	appointments: many(Appointment, {
		relationName: 'AppointmentToCoach'
	})
}));

export const AvailabilityRelations = relations(Availability, ({ one }) => ({
	coach: one(Coach, {
		relationName: 'AvailabilityToCoach',
		fields: [Availability.coachId],
		references: [Coach.id]
	})
}));

export const AppointmentRelations = relations(Appointment, ({ one }) => ({
	user: one(User, {
		relationName: 'AppointmentToUser',
		fields: [Appointment.userId],
		references: [User.id]
	}),
	coach: one(Coach, {
		relationName: 'AppointmentToCoach',
		fields: [Appointment.coachId],
		references: [Coach.id]
	})
}));

export const FMSRelations = relations(FMS, ({ one }) => ({
	user: one(User, {
		relationName: 'FMSToUser',
		fields: [FMS.userId],
		references: [User.id]
	})
}));

export const LeaderboardRelations = relations(Leaderboard, ({ one }) => ({
	user: one(User, {
		relationName: 'LeaderboardToUser',
		fields: [Leaderboard.userId],
		references: [User.id]
	}),
	routine: one(Routine, {
		relationName: 'LeaderboardToRoutine',
		fields: [Leaderboard.routineId],
		references: [Routine.id]
	})
}));