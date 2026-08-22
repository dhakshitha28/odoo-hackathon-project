package com.Dayflow.service;

import com.Dayflow.model.Company;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginIdGeneratorService {

    private final UserRepository userRepository;

    public String generateCompanyPrefix(String companyName) {
        String[] words = companyName.trim().split("\\s+");
        StringBuilder prefix = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                prefix.append(Character.toUpperCase(word.charAt(0)));
            }
        }
        return prefix.toString();
    }

    public String generateNameCode(String firstName, String lastName) {
        String first = firstName.length() >= 2
            ? firstName.substring(0, 2)
            : firstName;
        String last = lastName.length() >= 2
            ? lastName.substring(0, 2)
            : lastName;
        return (first + last).toUpperCase();
    }

    public String generateLoginId(Company company, String firstName, String lastName, int yearOfJoining) {
        int serial = userRepository.countByCompanyIdAndYearOfJoining(company.getId(), yearOfJoining) + 1;
        String serialPart = String.format("%04d", serial);

        return company.getPrefix()
            + generateNameCode(firstName, lastName)
            + yearOfJoining
            + serialPart;
    }
}