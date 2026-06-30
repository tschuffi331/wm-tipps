package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class TipsPage extends BasePage {

    private static final By HEADING        = By.cssSelector("h1");
    private static final By PHASE_SELECT   = By.id("phase-select");
    private static final By GROUP_FILTER   = By.cssSelector("[class*='GroupFilter'], button[class*='rounded']");
    private static final By MATCH_CARDS    = By.cssSelector("[class*='MatchCard'], .space-y-3 > div > *");
    private static final By TIP_INPUTS     = By.cssSelector("input[aria-label='Heimtore'], input[aria-label='Auswärtstore']");
    private static final By SAVE_BUTTONS   = By.xpath("//button[contains(text(),'Speichern')]");
    private static final By TIPS_COUNTER   = By.xpath("//*[contains(text(),'Spielen getippt')]");
    private static final By EMPTY_MSG      = By.xpath("//*[contains(text(),'Keine Spiele gefunden')]");
    private static final By PHASE_BADGE    = By.xpath("//*[contains(text(),'Aktive Phase')]");
    private static final By HOME_TIP_INPUT = By.cssSelector("input[aria-label='Heimtore']");
    private static final By AWAY_TIP_INPUT = By.cssSelector("input[aria-label='Auswärtstore']");

    public TipsPage(WebDriver driver) {
        super(driver);
    }

    public TipsPage open() {
        navigate("/tips");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public boolean isPhaseSelectVisible() {
        return isPresent(PHASE_SELECT);
    }

    public String getSelectedPhase() {
        return new org.openqa.selenium.support.ui.Select(
            driver.findElement(PHASE_SELECT)
        ).getFirstSelectedOption().getText();
    }

    public void selectPhase(String phaseText) {
        new org.openqa.selenium.support.ui.Select(
            waitVisible(PHASE_SELECT)
        ).selectByVisibleText(phaseText);
    }

    public List<WebElement> getMatchCards() {
        waitVisible(HEADING);
        return driver.findElements(By.cssSelector(".space-y-3 > div"));
    }

    public boolean hasTipInputs() {
        return isPresent(HOME_TIP_INPUT);
    }

    public boolean hasSaveButtons() {
        return isPresent(SAVE_BUTTONS);
    }

    public boolean hasGroupFilter() {
        return isPresent(By.cssSelector("[class*='overflow-x-auto']"));
    }

    public boolean hasEmptyMessage() {
        return isPresent(EMPTY_MSG);
    }

    public boolean hasTipsCounter() {
        return isPresent(TIPS_COUNTER);
    }

    public String getTipsCounterText() {
        return driver.findElement(TIPS_COUNTER).getText();
    }

    /** Fills the first visible save-enabled tip input pair. */
    public TipsPage fillFirstAvailableTip(int home, int away) {
        List<WebElement> homeInputs = driver.findElements(HOME_TIP_INPUT);
        List<WebElement> awayInputs = driver.findElements(AWAY_TIP_INPUT);
        if (homeInputs.isEmpty()) return this;
        WebElement h = homeInputs.get(0);
        WebElement a = awayInputs.get(0);
        h.clear(); h.sendKeys(String.valueOf(home));
        a.clear(); a.sendKeys(String.valueOf(away));
        return this;
    }

    public boolean isFirstSaveButtonEnabled() {
        List<WebElement> btns = driver.findElements(SAVE_BUTTONS);
        if (btns.isEmpty()) return false;
        return btns.get(0).isEnabled();
    }
}
