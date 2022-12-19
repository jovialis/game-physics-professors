/**
 * timeline
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

import {Panel} from "./elements/panel";
import {probSelect} from "./utils/probSelect";

export enum TraitKey {
	income = "income",
	gender = "gender",
	magnet_accepted = "$magnet_accepted",
	selected_high_school = "$selected_high_school",
	publications = "publications",
	uni_elite_accepted = "$elite_accepted",
	uni_state_accepted = "$state_accepted",
	selected_uni = "$university",
	prestige = "prestige",
	attended_undergrad_conference = "$attended_undergrad_conference",
	network = "network",
	graduate_uni = "Graduate Program"
}

export interface Timeline {
	initial_panel: Panel,
	panels: Panel[]
}

export const timeline: Timeline = {
	initial_panel: {
		id: "welcome",
		name: "Welcome",
		body: `Welcome to the game of Physics Professors. Over the course of the game, you will be presented with options of what career paths to follow. Your responsibility is to choose the best available path for your career goal of becoming a <b>tenured physics professor</b>. As you will learn, the best available path is not always within reach, and the pipeline from childhood to academia has quite a few leaks.`,
		options: [{name: "Begin", destination: "gender"}]
	},
	panels: [
		{
			id: "gender",
			name: "Select Your Gender",
			body: `Although it is an immutable part of your person, your gender imposes perhaps the first obstacle in your path. As of 2018, only <i>19% of physics faculty</i> members are women [1]. These disparities will persist throughout your academic career. Only around 19% of Bachelor’s degrees in the physical sciences are attained by women, and only 19.3% of Doctoral degrees [2]. Is this by choice, conditioning, or something else entirely?`,
			options: [
				{
					name: "Male",
					destination: "income_intro",
					onSelect: traits => {
						traits.setClass(TraitKey.gender, "male");
					}
				},
				{
					name: "Female",
					destination: "income_intro",
					onSelect: traits => {
						traits.setClass(TraitKey.gender, "female")
					}
				},
				{
					name: "Nonbinary",
					destination: "income_intro",
					onSelect: traits => {
						traits.setClass(TraitKey.gender, "nonbinary");
					}
				},
			],
			sources: [
				"https://www.aip.org/statistics/reports/women-among-physics-and-astronomy-faculty",
				"https://onlinelibrary.wiley.com/doi/full/10.1002/jnr.24631"
			]
		},
		{
			id: "income_intro",
			name: "Childhood Income Level",
			body: `You cannot decide your family’s income, and thus, you will be randomly placed into an income bracket. 30% of the US population is classified as “low income,” 50% as “medium income,” and 21% as “high income” [1].`,
			options: [
				{
					name: "Decide My Family's Income",
					destination: "income_assigned",
					onSelect: traits => {
						const income = probSelect([
							{prob: 30, val: "Low"},
							{prob: 50, val: "Medium"},
							{prob: 20, val: "High"}
						]);
						traits.setClass(TraitKey.income, income);
					}
				}
			],
			sources: [
				"https://www.investopedia.com/financial-edge/0912/which-income-class-are-you.aspx"
			]
		},
		{
			id: "income_assigned",
			name: "Your Income Level",
			body: trait => {
				return `Your family is <b>${trait.getClass(TraitKey.income) + " income</b>."}
				<br/>
				<br/>
				Your family’s income when you are a child imposes perhaps the greatest obstacle in your journey to becoming a successful professor. Your income determines everything, from what school you attend, to the after school opportunities you have available to you, to how much time you spend on your homework. It will also affect you throughout your career.`
			},
			options: [
				{
					name: "Continue",
					destination: "school_select"
				}
			]
		},
		{
			id: "school_select",
			name: "Select Your School",
			body: "The school choices available to you are entirely dependent on your circumstances, yet they will have an unmatched impact on your involvement in STEM. Private schools and STEM magnet programs provide a more comprehensive education and more STEM exposure compared to public schools, which are largely underfunded across the United States.",
			onLoad: (traits => {
				const intelligence = Math.random() * 100;

				// const genderBoost = traits.isClass(TraitKey.gender, "female") ? 10 : (traits.isClass(TraitKey.gender, "nonbinary") ? 15 : 0);
				const magnetAcceptanceRate = 40// + genderBoost;
				traits.addStat(TraitKey.magnet_accepted, intelligence < magnetAcceptanceRate ? 1 : 0);
			}),
			options: [
				{
					name: "Private K-12",
					destination: "school_lots_science",
					isEnabled: traits => {
						return ["high"].includes(traits.getClass(TraitKey.income)!) || "You cannot afford to attend a private school."
					},
					onSelect: traits => {
						traits.setClass(TraitKey.selected_high_school, "private")
					}
				},
				{
					name: "STEM Magnet School",
					destination: "school_lots_science",
					isEnabled: traits => {
						return traits.hasStat(TraitKey.magnet_accepted, 1) || "You were not accepted to the magnet school, which has an acceptance rate of 40%. "
					},
					annotation: "You were admitted to the STEM magnet school with an acceptance rate of 40%. Congratulations!",
					onSelect: traits => {
						traits.setClass(TraitKey.selected_high_school, "STEM Magnet")
					}
				},
				{
					name: "Public School",
					destination: "school_low_science",
					onSelect: traits => {
						traits.setClass(TraitKey.selected_high_school, "Local Public")
					}
				}
			]
		},
		{
			id: "school_lots_science",
			name: "Strong Science Teaching",
			history_include: true,
			body: trait => {
				return `
					Your ${trait.getClass(TraitKey.selected_high_school, true)} school was well funded with a laboratory, and experiential learning (and teaching) methods allowing you to gain early hands-on exposure to physics in the classroom. You were also exposed to online <i>blended learning</i>—supplemental learning through online courses—which helped reinforce your classroom experiences [1]. 
					<br/></br>
					Most importantly, however, you received individualized and thoughtful instruction from your teachers. Studies have shown that instructor support is a crucial factor in encouraging students to pursue STEM in college [2].
				`
			},
			options: [
				{
					name: "Continue",
					onSelect: (traits) => {
						if (traits.isClass(TraitKey.selected_high_school, "stem magnet") || Math.random() > .7)
							return "highschool_pub"
					},
					destination: "college_applications"
				}
			],
			sources: [
				"https://eric.ed.gov/?id=EJ1231349",
				"https://www.frontiersin.org/articles/10.3389/feduc.2020.00025/full"
			]
		},
		{
			id: "highschool_pub",
			name: "High School Research",
			history_include: true,
			body: trait => {
				return `
					Because of your strong performance in class, your High School physics teacher connected you to a local research laboratory where you were able to conduct research during the school year under an AP Seminar program [1].
					<br/><br/>
					You were listed as a third author on the subsequent paper which was published in your Junior Year. Your first publication!
				`
			},
			onLoad: traits => {
				traits.addStat(TraitKey.publications, 1);
			},
			options: [
				{
					name: "Continue",
					destination: "college_applications"
				}
			],
			sources: [
				"https://www.forbes.com/sites/kristenmoon/2021/03/29/a-guide-for-pursuing-independent-scientific-research-opportunities-in-high-school/?sh=258bf5fca573"
			]
		},
		{
			id: "school_low_science",
			name: "Weak Science Teaching",
			history_include: true,
			body: trait => {
				return `
					Your ${trait.getClass(TraitKey.selected_high_school, true)} school was poorly funded, and your early exposure to STEM was primarily focused on recitation and memorization. The local school district could not afford to stock the chemicals and materials needed for you to conduct experiments in a lab, and your classes were frequently taught by a single, hugely outnumbered teacher who couldn’t provide individualized instruction. Studies have shown that instructor support is a crucial factor in encouraging students to pursue STEM in college [1].
				`
			},
			options: [
				{
					name: "Continue",
					destination: "college_applications"
				}
			],
			sources: [
				"https://www.frontiersin.org/articles/10.3389/feduc.2020.00025/full"
			]
		},
		{
			id: "college_applications",
			name: "Choosing a College",
			body: trait => {
				return `College is the first big step in your dream of becoming a physics professor. Your college will determine what professors, research, and Doctorate opportunities are available for you. It will also determine the type of teaching you will receive.
				<br/><br/>
				While the nation’s elite Universities are the most recognizable, only around 6% of U.S. students are able to attend one of these Universities [1]. Other college options include your state University and community colleges. While you may receive similar teaching at all three, the opportunities you will have are certainly not the same.`
			},
			onLoad: traits => {
				let libarts = false;

				// Decide whether or not they get accepted to elite liberal arts
				// Low acceptance rate; publications
				if (traits.hasStat(TraitKey.publications, 1)) {
					libarts = true;
				}

				let stateUni = false;

				// Decide whether they get accepted to state Uni
				const random = Math.random();
				if (traits.isClass(TraitKey.income, "high") || traits.isClass(TraitKey.income, "medium") || random > 0.5) {
					stateUni = true;
				}

				traits.setClasses([
					{key: TraitKey.uni_state_accepted, val: stateUni ? "yes" : "no"},
					{key: TraitKey.uni_elite_accepted, val: libarts ? "yes" : "no"}
				]);
			},
			options: [
				{
					name: "Elite Liberal Arts University",
					destination: "elite_uni_welcome",
					isEnabled: traits => {
						if (traits.isClass(TraitKey.uni_elite_accepted, "yes"))
							return true;

						if (traits.isClass(TraitKey.selected_high_school, "private")) {
							return "You were not accepted. You might have differentiated yourself through extracurriculars like research in high school."
						} else {
							return "You were not accepted. You might have differentiated yourself through extracurriculars like research in high school, but you didn't have that opportunity."
						}
					},
					annotation: "You were accepted thanks to your research in High School. Your tuition is covered for you.",
					onSelect: traits => {
						traits.setClass(TraitKey.selected_uni, "elite university")
					}
				},
				{
					name: "State University",
					destination: "state_uni_welcome",
					isEnabled: traits => {
						return traits.isClass(TraitKey.uni_state_accepted, "yes") ||
							"You could not afford to pay the in-state tuition."
					},
					onSelect: traits => {
						traits.setClass(TraitKey.selected_uni, "state university")
					}
				},
				{
					name: "Community College",
					destination: "comm_uni_welcome",
					onSelect: traits => {
						traits.setClass(TraitKey.selected_uni, "community college")
					}
				}
			]
		},
		{
			id: "elite_uni_welcome",
			name: "Elite Liberal Arts University",
			history_include: true,
			onLoad: traits => {
				traits.setClasses([
					{key: TraitKey.prestige, val: "high"},
					// {key: TraitKey.income, val: undefined}
				])
			},
			body: `Congratulations. You are a member of <i>ELAU</i>’s most elite, distinguished, diverse, and talented class yet. Your time here will mold you into a deeper thinker, will broaden your mind, and will shape you into a person who’s ready to change the world.`,
			options: [
				{name: "Continue", destination: "class_size_small"}
			]
		},
		{
			id: "state_uni_welcome",
			name: "State University",
			history_include: true,
			onLoad: traits => {
				traits.setClasses([
					{key: TraitKey.prestige, val: "low"},
					// {key: TraitKey.income, val: undefined}
				])
			},
			body: `Congratulations. As a newfound member of <i>SU</i>’s class of 2026, you're a part of 200-some years of our state's heritage. We nurture the brightest minds to tackle the biggest challenges for the next 200. 'Gig em!`,
			options: [
				{name: "Continue", destination: "class_size_large"}
			]
		},
		{
			id: "comm_uni_welcome",
			name: "Community College",
			history_include: true,
			onLoad: traits => {
				traits.setClasses([
					{key: TraitKey.prestige, val: "low"},
					// {key: TraitKey.income, val: undefined}
				])
			},
			body: `Congratulations. At <i>CC</i>, we teach you the skills you need to succeed. From here, to almost anywhere.`,
			options: [
				{name: "Continue", destination: "class_size_nostem"}
			]
		},
		{
			id: "class_size_small",
			name: "Small Class Size",
			history_include: true,
			body: `<i>ELAU</i> prizes itself on its small class sizes and its 7:1 student to faculty ratio. The national average is 18:1 [1]. With a handful of students per class and professors who you get to know personally, you feel supported and engaged with the material, even though the difficulty of the material is intense.
				<br/><br/>
				Your favorite professor, Prof. X, takes notice of your passion for physics after you visit his office hours all semester. After you tell him about your high school research, he invites you to join his solid-state physics lab.`,
			options: [
				{
					name: "Participate in Research",
					destination: "undergrad_research"
				}
			],
			sources: [
				"https://collegesofdistinction.com/advice/35-best-student-faculty-college-ratios-for-2022"
			]
		},
		{
			id: "class_size_large",
			name: "Large Class Size",
			onLoad: traits => {
				if (Math.random() > .6) {
					traits.setClass("$large_class_research", "yes");
				}
			},
			history_include: true,
			body: `<i>SU</i> has 36,000 Undergraduates, and even your most specialized classes contain hundreds of students. With only a single professor teaching the course, you don’t get a chance to learn about their research and primarily interact with your Teaching Assistant. As the difficulty of the material increases, you feel less and less supported.`,
			options: [
				{
					name: "Continue",
					onSelect: traits => {
						if (traits.hasStat(TraitKey.publications, 1) || traits.isClass("$large_class_research", "yes")) {
							return "largeclass_undergrad_research_welcome"
						}

						return "undergrad_next_steps"
					}
				},
			]
		},
		{
			id: "largeclass_undergrad_research_welcome",
			name: "Research Opportunity",
			body: `Despite <i>SU</i>’s large class size, you applied to a professor’s solid-state physics research lab and were ultimately accepted. You’re one of a minority; with so many students interested in the same topic, most have a hard time finding a place to conduct research as an Undergraduate.`,
			options: [
				{
					name: "Research",
					destination: "undergrad_research"
				}
			]
		},
		{
			id: "undergrad_next_steps",
			name: "Undergraduate Next Steps",
			body: `You’re a Junior, and it’s time for you to decide what the next part of your life will be. For you to continue in physics, you will need to apply to a PhD program and receive your Doctorate. This is also a time for reflection; do you even want to become a physics professor? While many Undergraduates improve their Graduate School odds by participating in research, you did not have that opportunity.`,
			onLoad: traits => {
				let outcome = "continue";
				if (!traits.isClass(TraitKey.gender, "male")) {
					if (Math.random() > .5) {
						outcome = "switch"
					}
				}

				traits.setClass("$large_class_outcome", outcome);
			},
			options: [
				{
					name: "Continue",
					destination: "grad_application",
					isEnabled: traits => {
						if (!traits.isClass("$large_class_outcome", "switch"))
							return true;
						return "You were one of the only people of your gender in the major and all of your professors and TAs were men. You did not receive adequate support, and thus, you no longer want to pursue physics."
					}
				},
				{
					name: "Switch Majors",
					destination: "transfer_focus"
				}
			]
		},
		{
			id: "class_size_nostem",
			name: "Few good STEM courses",
			history_include: true,
			body: `<i>CC</i> has a weak STEM focus and is primarily focused on helping students obtain professional degrees. Even though you are passionate about physics and seek out any opportunities that you can, there is very little support from knowledgeable professors, and you are unable to even attend upper-level STEM courses [1].`,
			options: [
				{
					name: "Switch Major",
					destination: "transfer_focus"
				}
			],
			sources: [
				"https://link.springer.com/article/10.1007/s11162-022-09713-8"
			]
		},
		{
			id: "transfer_focus",
			name: "Transferred Majors",
			body: "You decided that physics wasn't for you and transferred majors. You may be a successful academic some day, but it's too late for you to become a renowned physicist.",
			is_loss: true,
			options: []
		},
		{
			id: "undergrad_research",
			name: "Undergraduate Research",
			history_include: true,
			body: `You participate in solid-state physics research as an Undergraduate. Very few others have the same opportunity. A recent survey found that only 28% of Undergraduates actually participate in research [1], although that statistic increases dramatically for Undergraduates in the physical sciences with many schools reporting rates of 50% or higher [2][3]. Conducting research is hugely important for improving your admissions chances to Graduate School.
				<br/>
				<br/>
				Under your research lab’s principle investigator (PI), you are listed on three upcoming publications, including one in a high-impact journal. Your professor is impressed and writes you a stellar letter of recommendation for your Doctoral applications; he even contacts his friend in graduate admissions at <i>Elite Liberal Arts University</i>.`,
			onLoad: traits => {
				let conference = false;
				if (Math.random() > .5) {
					conference = true;
				}

				traits.setClass(TraitKey.prestige, "medium")
				traits.addStats([
					{key: TraitKey.publications, amt: 3},
					{key: TraitKey.network, amt: 10},
					{key: TraitKey.attended_undergrad_conference, amt: conference ? 1 : 0}
				]);
			},
			options: [
				{
					name: "Continue",
					onSelect: traits => {
						if (traits.hasStat(TraitKey.attended_undergrad_conference, 1)) {
							return "undergrad_conference"
						} else {
							return "grad_application"
						}
					}
				}
			],
			sources: [
				"https://cra.org/crn/2018/04/understanding-why-most-undergraduate-students-dont-participate-in-research/",
				"https://publish.illinois.edu/phystudentadvisoryboard/physics-graduate-school/getting-undergraduate-research",
			]
		},
		{
			id: "undergrad_conference",
			name: "Attended a Conference",
			history_include: true,
			body: `The paper published in a high-impact journal attracted some attention, and your professors invited you to attend a major conference and present your work. The conference will attract tens of thousands of leading researchers. 
			<br/><br/>
			While most of the presenters there will be Doctoral students, Post-Docs, and professors, you are one of the few Undergraduates offered an opportunity to present. Attending the conference is prestigious and will grow your professional network enormously.`,
			onLoad: traits => {
				traits.setClass(TraitKey.prestige, "high");
			},
			options: [
				{
					name: "Attend",
					destination: "grad_application",
					isEnabled: (traits) => {
						if (traits.isClass(TraitKey.selected_uni, "elite university"))
							return true;

						if (!traits.isClass(TraitKey.income, "low"))
							return true;

						if (Math.random() > .6)
							return true;

						return "You cannot afford to pay for your flight and housing, and your University does not have the disposable funds to pay for you."
					},
					onSelect: (traits) => {
						traits.addStat(TraitKey.network, 200);
					}
				},
				{
					name: "Skip",
					destination: "grad_application"
				}
			]
		},
		{
			id: "grad_application",
			name: "Apply to Graduate School",
			body: `To become a physics professor, you need to receive a doctoral degree via a graduate program. Unfortunately, degrees take their toll. It takes on average 6.2 years to receive a PhD in physics [1], and although the average salary for a degree-holding PhD physicist is around $140k/year [2], there are few financial incentives while completing your degree. 
				<br/><br/>
				Doctoral programs are typically paid for with grants, but you will receive, on average, less than $25k/year to pay for all living expenses including housing and food [3]. Not everyone can afford the opportunity cost. An undergraduate physics degree can easily make $200k/year in finance immediately out of school.`,
			options: [
				{
					name: "Apply to Graduate School",
					destination: "grad_application_results",
					isEnabled: (traits) => {
						// Low impact so far
						if (traits.getStat(TraitKey.network) <= 10 && traits.getStat(TraitKey.publications) < 4) {
							// Medium or low income
							if (!traits.isClass(TraitKey.income, "high")) {
								return "Your family is struggling financially and you cannot rationalize pursuing science given your progress thus far."
							}
						}
						return true;
					}
				},
				{
					name: "Work on Wall Street",
					destination: "industry",
				}
			],
			sources: [
				"https://www.aip.org/statistics/reports/trends-physics-phds-171819",
				"https://www.erieri.com/salary/job/physicist-phd/united-states",
				"https://physics.ucdavis.edu/graduates/financial-aid"
			]
		},
		{
			id: "grad_application_results",
			name: "Choose Your Graduate School",
			onLoad: traits => {
				// 50% chance you don't get accepted to any
				let elite = false;
				let good = false;

				if (traits.hasStat(TraitKey.network, 50) && traits.hasStat(TraitKey.publications, 3)) {
					elite = true;
				}

				if (elite || Math.random() > .5) {
					good = true;
				}

				traits.setClasses([
					{key: "$grad_app_elite_acc", val: elite ? "yes" : "no"},
					{key: "$grad_app_good_acc", val: good ? "yes" : "no"},
				])
			},
			body: `Getting accepted to a physics Doctoral program is intensely competitive. While the top programs have an acceptance rate of around 10%, even less prestigious programs typically have an acceptance rate lower than 30%. The applicant pool itself is composed of Undergraduates from the most prestigious universities and most rigorous backgrounds [1] meaning that you are lucky to even get a spot.
				<br/><br/>
				This competitiveness owes credit to the nature of these programs. In addition to fully covering your tuition for the better half of a decade, the programs offer you a chance to receive comprehensive apprenticeship from a leading researcher in your subfield of physics. A systemic lack of bandwidth from both funding and personnel undercuts the number of Undergraduates who can become Doctoral candidates.`,
			options: [
				{
					name: "Elite Physics Program",
					annotation: "Your publications and network earned you a position at one of the top programs.",
					onSelect: traits => {
						traits.setClasses([
							{key: TraitKey.income, val: undefined},
							{key: TraitKey.prestige, val: "high"},
							{key: TraitKey.graduate_uni, val: "elite"}
						]);
					},
					isEnabled: traits => {
						return traits.isClass("$grad_app_elite_acc", "yes") ||
							"Your publications and network did not stand out enough to earn you a spot."
					},
					destination: "grad_school"
				},
				{
					name: "Good Physics Program",
					destination: "grad_school",
					onSelect: traits => {
						traits.setClasses([
							{key: TraitKey.income, val: undefined},
							{key: TraitKey.prestige, val: "medium"},
							{key: TraitKey.graduate_uni, val: "good"}
						]);
					},
					isEnabled: traits => {
						return traits.isClass("$grad_app_good_acc", "yes") ||
							"You were not granted admission due to an extremely competitive application season."
					},
				},
				{
					name: "Work in Industry",
					destination: "industry2"
				}
			]
		},
		{
			id: "industry",
			name: "Work on Wall Street",
			body: "You needed to earn money shortly after graduation, and thus, you needed to switch out of the academic pipeline.",
			is_loss: true,
			options: []
		},
		{
			id: "industry2",
			name: "Work in Industry",
			body: "Without securing a spot at a Graduate program, you have no choice but to apply your physics knowledge in industry. Don't fret. You might not become a top academic, but you can easily pull a six-figure job at Raytheon.",
			is_loss: true,
			options: []
		},
		{
			id: "grad_school",
			name: "You Got Into a Grad School",
			is_won: true,
			body: "Congratulations! You're well on your way to becoming a physics professor. Unfortunately, the rest of the game has not yet been built, so you'll need to check back later to continue your journey.",
			options: []
		}
	]
}