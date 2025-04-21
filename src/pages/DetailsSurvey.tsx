

import React from 'react';
import CaseActive from '../assets/img/banneractive.svg';
import CaseComingFinished from '../assets/img/bannercomingfinished.svg';
import CaseNotPublic from '../assets/img/bannernotpublic.svg';
import CaseFinished from '../assets/img/bannerfinished.svg';

import NavigationBackButton from '../components/NavigationBackButton';
import Calendar from '../components/Calendar';
import RichTextEditor from '../components/TextBoxDetail';


const DetailsSurvey = () => {
    const showBackButton = true; // Define the variable
    const currentView = "defaultView"; // Define currentView as well

    return (
        <div>
            <div className="mb-4">
                <img src={CaseActive} alt="Banner" className="w-full h-auto" />
                <img src={CaseComingFinished} alt="Banner" className="w-full h-auto" />
                <img src={CaseNotPublic} alt="Banner" className="w-full h-auto" />
                <img src={CaseFinished} alt="Banner" className="w-full h-auto" />
                {showBackButton && <NavigationBackButton currentView={currentView} className="default-class" />}
                <div className="mb-4">
                    <div className="mb-1 border border-white p-0">
                        <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Rango de tiempo</h2>
                    </div>
                    <div className="flex space-x-4">
                        <div className="border border-white relative">
                            {/* Calendario de inicio con control de apertura/cierre */}
                            <Calendar
                                initialDate={startDate}
                                selectedDate={startDate}
                                onDateSelect={handleStartDateChange}
                                buttonLabel="Fecha de Inicio:"
                                calendarIcon={calendar2}
                                isEndDate={false}
                                isOpen={showStartCalendar}
                                onOpenChange={(isOpen) => {
                                    setShowStartCalendar(isOpen);
                                    // Si abrimos el calendario de inicio, cerramos el de finalización y el dropdown de secciones
                                    if (isOpen) {
                                        setShowEndCalendar(false);
                                        setShowSectionDropdown(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Sección de descripción */}
                    <div className="mb-4">
                        <div className="mb-2 border border-white">
                            <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Descripción de la Encuesta</h2>
                        </div>
                        <div className="border border-white">
                            <RichTextEditor
                                value={description}
                                onChange={(value) => setDescription(DOMPurify.sanitize(value))} // Sanitizar la descripción
                            />
                        </div>
                        {/* Segunda sección - Secciones de la encuesta */}
                                  <div className="mb-4">
                                    <div className="mb-1 border border-white">
                                      <h2 className="font-work-sans text-2xl font-bold text-dark-blue-custom">Secciones</h2>
                                    </div>
                                    <p className="font-work-sans text-sm mb-3 text-gray-600">
                                      Agrega las secciones en las que clasificarás las preguntas.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {sections.map(section => (
                                        <div 
                                          key={section.id} 
                                          className="border border-white relative"
                                        >
                                          <div className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                                            <span 
                                              className="bg-orange-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80 cursor-pointer"
                                              onClick={(e) => handleRemoveSection(section.id, e)}
                                            >
                                              <img src={trashcan} alt="Eliminar Sección" className="w-5 h-5" />
                                            </span>
                                            <span className="bg-gray-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                                              <span className="font-work-sans text-lg font-semibold text-blue-custom">
                                                {section.name}
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      <div className="border border-white relative">
                                        <button 
                                          ref={newSectionButtonRef}
                                          className="hidden md:flex items-stretch rounded-full overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                                          onClick={handleSectionButtonClick}
                                        >
                                          <span className="bg-blue-custom text-white px-4 py-1 flex items-center justify-center hover:bg-opacity-80">
                                            <img src={Addsurvey} alt="Nueva sección" className="w-5 h-5" />
                                          </span>
                                          <span className="bg-yellow-custom px-5 py-1 flex items-center justify-center hover:bg-opacity-80">
                                            <span className="font-work-sans text-lg font-semibold text-blue-custom">
                                              Nueva Sección
                                            </span>
                                          </span>
                                        </button>
                                        
                                        {/* Dropdown de secciones (aparece bajo el botón) */}
                                        <SectionDropdown
                                          isOpen={showSectionDropdown}
                                          onOpenChange={setShowSectionDropdown}
                                          onAddSections={handleUpdateSections}
                                          onCancel={() => setShowSectionDropdown(false)}
                                          existingSections={sections}
                                          anchorRef={newSectionButtonRef}
                                        />
                                      </div>
                                    </div>
                                  </div>
                    </div>
                </div>
            </div>
            );
}

            export default DetailsSurvey;