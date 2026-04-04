import sys

file_path = r"d:\GuideWireDevtrails\src\App.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will find "const renderOnboarding = () => ("
start_idx = content.find("  const renderOnboarding = () => (")
if start_idx == -1:
    print("Could not find start of renderOnboarding")
    sys.exit(1)

# I will find the end of it which is "  const renderRiderDashboard = () => {"
end_idx = content.find("  const renderRiderDashboard = () => {", start_idx)
if end_idx == -1:
    print("Could not find end of renderOnboarding")
    sys.exit(1)

# We will replace everything between start_idx and end_idx
replacement = """  const renderOnboarding = () => (
    <RegistrationFlow 
      riderInfo={riderInfo}
      setRiderInfo={setRiderInfo}
      setWorkerId={setWorkerId}
      setCurrentView={setCurrentView}
      setCalculatedPremium={setCalculatedPremium}
      setCoverageAmount={setCoverageAmount}
      setRScore={setRScore}
    />
  );

"""

new_content = content[:start_idx] + replacement + content[end_idx:]

# Also we need to add the import statement at the top
import_statement = "import RegistrationFlow from './RegistrationFlow';\n"
if import_statement not in new_content:
    import_idx = new_content.find("import ControlCenter")
    new_content = new_content[:import_idx] + import_statement + new_content[import_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replaced successfully")
