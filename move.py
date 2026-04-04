import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_exp = -1
end_exp = -1
for i, line in enumerate(lines):
    if "{/* Experience on the Go Section */}" in line:
        start_exp = i
    if "                 {/* Home Indicator */}" in line:
        # 624:                  {/* Home Indicator */}
        # 625:                  <div style={{ position:... }}></div>
        # 626:               </div>
        # 627:             </div>
        # 628:           </div>
        # 629:         </div>
        end_exp = i + 5
        break

if start_exp != -1 and end_exp != -1:
    section_lines = lines[start_exp:end_exp+1]
    
    # Remove from original place
    del lines[start_exp:end_exp+1]
    
    # Find Why Choose
    start_why = -1
    for i, line in enumerate(lines):
        if "{/* Why Choose AEGIS Section */}" in line:
            start_why = i
            break
            
    if start_why != -1:
        # Insert
        lines = lines[:start_why] + section_lines + lines[start_why:]
        
        with open('src/App.jsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Moved successfully.")
    else:
        print("Why Choose section not found.")
else:
    print(f"Experience section not found. start_exp: {start_exp}, end_exp: {end_exp}")
