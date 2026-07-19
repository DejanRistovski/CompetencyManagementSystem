package org.example.competencymanagementsystem.ai.services;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import org.example.competencymanagementsystem.model.dto.ExtendedSkillDTO;
import org.example.competencymanagementsystem.model.dto.GeneratedSkillDTO;

import java.util.List;

public interface SkillExtractorAgent {

    @SystemMessage("""
            You are a skill extractor. Given the data extract names for the skill that are contained in the chunked text.
            This skills will be used in an ERP system for skill and competency organization. The skills need to be something an employee can have.
            
            Extract all skills mentioned, including:
            - Technical skills (programming languages, tools, frameworks, software)
            - Soft skills (communication, leadership, teamwork)
            - Domain knowledge (finance, marketing, healthcare)
            - Certifications or methodologies (Agile, PMP, AWS)
            
            Generating rules:
            1) Never generate skill names with levels in the name.
            2) Never generate skills that you are not sure exist in the given text.
            3) If no useful skills can be extracted return empty list.
            4) The skill names need to be generic and not specific to the given text.
            5) Try to generate the name in its most base form
            6) Generate maximum 5 skills
            """)
    @UserMessage("""
            Extract all skills from the following text:
            {{message}}
            """)
    List<String> extractSkills(@V("message") String message);

    @SystemMessage("""
            You are a generator for levels of a skill. You are given a skill name and context. The context is the text that you need to use to extract the levels for that skill.
            
            Follow these rules when creating levels:
            1) Every level needs the following data:
            	* name - simple and precise (ex. Beginner, Intermediate, Advanced)
            	* expectation - summary of max 255 characters what it is expected from employees that have this level of the skill
            	* levelOrder - the number of level that this skill is (ex. 1, 2, 3)
            2) All levels for a skill need to have a clear path for progression defined in the level expectations
            3) The skill description needs to be generic description of what an employee needs to posses to have this skill
                * Don't include the context in the skill description, try to make it generic
            4) YOU MUST generate all levels for skill:
                * 'name': the name of the new skill
                * 'levels': generate all the levels for that skill even if the context is only for a certain level
                * 'basedLevel': the name of the level that corresponds to the given context
            
            This entities will be used in an ERP system for skill and competency organization.
            Always follow the schema given to you when generating an output.
            """)
    @UserMessage("""
            Skill name: {{skillName}}
            Context:
            {{context}}
            """)
    GeneratedSkillDTO generateSkill(@V("skillName") String skillName, @V("context") String context);

    @SystemMessage("""
            You are a matcher for given skill to existing skills in the context. You are given a skill name and context.
            You need to either match the given skill to some level that exists in the system, or return -1 if it cant be matched. Use the context to decide the matched level.
            If the level matches the skill but not the levels, return -1. If no level is matched return -1. Never invent new level ids and never return skill ids.
            Dont match the level if you are not sure, just return -1.
            Only return the level id.
            """)
    @UserMessage("""
            Skill name: {{skillName}}
            Context:
            {{context}}
            
            Existing skill:
            {{similarSkill}}
            """)
    Long matchSkill(@V("skillName") String skillName, @V("context") String context, @V("similarSkill") String similarSkill);

    @SystemMessage("""
            You are a skill extender. Given the skill name and context you need to decide whether the existing skill can be extended with a new level.
            Example you can add a level between existing levels, a new level that is at the bottom or new level that is the highest.
            If the skill can be extended generate the new level. Dont extend the skill if you are not sure, just return the object with null values.
            If the skill cannot be extended then return the object with null values.
            """)
    @UserMessage("""
            Skill name: {{skillName}}
            Context:
            {{context}}
            
            Existing skill:
            {{similarSkill}}
            """)
    ExtendedSkillDTO extendSkill(@V("skillName") String skillName, @V("context") String context, @V("similarSkill") String similarSkill);
}
